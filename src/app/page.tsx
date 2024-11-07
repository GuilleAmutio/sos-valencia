// src/app/page.tsx
"use client"; // Add this line to make this a client component

import {ChangeEvent, Fragment, useEffect, useRef, useState} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import EmergencyInformation from "@/components/EmergencyInformation";
import {ChevronLeftIcon, ChevronRightIcon} from "@/components/Icons";
import { processTextWithLinks } from '@/utils/linkUtils';
import Header from '@/components/Header';
import ImageCarousel from '@/components/ImageCarousel';

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrls?: string[]; // Changed from imageUrl to imageUrls array
  createdAt: string | Date;
  comments: {
    text: string;
    createdAt: Date;
  }[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<{ title: string; description: string; imageUrls?: string[] }>({
    title: '',
    description: '',
    imageUrls: [],
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [10, 25, 50, 100];
  const [sortOrder, setSortOrder] = useState('newest');
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  useEffect(() => {
    // Fetch posts from the API when the component mounts
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      console.log('Fetched posts:', data);
      setPosts(data);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentSlide(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      setNewPost(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async () => {
    // Reset errors
    setTitleError(false);
    setDescriptionError(false);

    // Validación
    if (!newPost.title.trim()) {
      setTitleError(true);
      return;
    }

    if (!newPost.description.trim()) {
      setDescriptionError(true);
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const savedPost = await res.json();
      console.log('Saved post from server:', savedPost);
      
      setPosts(currentPosts => [...currentPosts, savedPost]);
      
      setNewPost({ title: '', description: '', imageUrls: [] });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      const refreshRes = await fetch('/api/posts');
      const refreshedPosts = await refreshRes.json();
      setPosts(refreshedPosts);
      
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const getFilteredAndSortedPosts = () => {
    // First apply search filter
    const searchFiltered = posts.filter(post => {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
    });

    // Then sort by date
    return searchFiltered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
  };

  const filteredAndSortedPosts = getFilteredAndSortedPosts();
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredAndSortedPosts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComment = async (postId: string) => {
    try {
      const commentText = commentTexts[postId];
      if (!commentText?.trim()) return;

      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      // Reset solo el comentario de este post específico
      setCommentTexts(prev => ({
        ...prev,
        [postId]: ''
      }));
      
      // Refresh posts to show new comment
      const refreshRes = await fetch('/api/posts');
      const refreshedPosts = await refreshRes.json();
      setPosts(refreshedPosts);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <main className="min-h-screen bg-white w-full pb-[200px]">
      <div className="max-w-4xl mx-auto px-4 pb-96 bg-white pt-0 mt-0">
        <Header />
        
        {/* Sticky container for search and pagination */}
        <div className="pb-4">
          <div className="max-w-4xl mx-auto px-4 pt-4">
            {/* Search Bar with enhanced shadow */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar publicaciones..."
                  className="w-full px-4 py-3 pl-10 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black shadow-sm hover:shadow-md transition-shadow"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black shadow-sm hover:shadow-md transition-shadow"
              >
                <option value="newest">Más recientes primero</option>
                <option value="oldest">Más antiguos primero</option>
              </select>
            </div>

            {/* Pagination Controls with enhanced design */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md border border-blue-100">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Mostrar:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="text-gray-600">por página</span>
              </div>

              {/* Page numbers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
                >
                  ←
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || 
                           page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <Fragment key={`ellipsis-${page}`}>
                          <span className="px-2 text-gray-500">...</span>
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {page}
                          </button>
                        </Fragment>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
                >
                  →
                </button>
              </div>

              {/* Posts count */}
              <div className="text-gray-600">
                Mostrando {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, getFilteredAndSortedPosts().length)} de {getFilteredAndSortedPosts().length}
              </div>
            </div>
          </div>
        </div>

        <EmergencyInformation></EmergencyInformation>

        {/* Existing Posts */}
        <div className="space-y-6 mb-20">
          {currentPosts.map((post) => (
            <div 
              key={post._id} 
              className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full backdrop-filter backdrop-blur-sm"
              style={{
                background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <Link 
                href={`/posts/${post._id}`} 
                prefetch={true}
                className="text-2xl font-medium text-gray-800 hover:text-blue-700 transition-colors cursor-pointer block mb-3"
              >
                <h2 className="break-words whitespace-pre-wrap overflow-hidden">{post.title}</h2>
              </Link>

              {/* Image carousel with enhanced shadows */}
              {post.imageUrls && (
                <ImageCarousel 
                  images={post.imageUrls} 
                  onImageClick={(url) => setSelectedImage(url)}
                  className="mb-4"
                />
              )}

              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                {processTextWithLinks(post.description)}
              </p>

              {/* Comments section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Comentarios ({post.comments.length})
                </h3>
                
                {/* Comment form */}
                <div className="mt-4">
                  <textarea
                    placeholder="Escribe un comentario..."
                    value={commentTexts[post._id] || ''}
                    onChange={(e) => setCommentTexts(prev => ({
                      ...prev,
                      [post._id]: e.target.value
                    }))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm resize-none text-black"
                    rows={3}
                  />
                  <button
                    onClick={async () => {
                      if (!commentTexts[post._id]?.trim()) return;
                      
                      try {
                        const res = await fetch(`/api/posts/${post._id}/comments`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ text: commentTexts[post._id] }),
                        });

                        if (!res.ok) throw new Error('Failed to post comment');

                        // Reset solo el comentario de este post específico
                        setCommentTexts(prev => ({
                          ...prev,
                          [post._id]: ''
                        }));
                        
                        // Refresh posts to show new comment
                        const refreshRes = await fetch('/api/posts');
                        const refreshedPosts = await refreshRes.json();
                        setPosts(refreshedPosts);
                      } catch (error) {
                        console.error('Error posting comment:', error);
                      }
                    }}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Comentar
                  </button>
                </div>

                {/* Display last 2 comments */}
                <div className="mt-4 space-y-3">
                  {post.comments.slice(-2).map((comment, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 break-words whitespace-pre-wrap overflow-hidden">
                        {processTextWithLinks(comment.text)}
                      </p>
                      <span className="text-sm text-gray-500 mt-1 block">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  
                  {/* "Ver más" link if there are more than 2 comments */}
                  {post.comments.length > 2 && (
                    <Link 
                      href={`/posts/${post._id}`}
                      className="block mt-3 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver todos los comentarios ({post.comments.length})
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main container for create post form */}
      <div className="fixed bottom-0 left-0 right-0">
        {/* Form container with button - entire unit slides */}
        <div 
          className={`bg-gray-100 border-t-2 border-blue-200 shadow-lg w-full transition-transform duration-300 ${
            isCreatePostOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Button - always at top of form */}
          <button
            onClick={() => setIsCreatePostOpen(!isCreatePostOpen)}
            className="absolute left-1/2 transform -translate-x-1/2 -top-10 bg-blue-600 text-white px-6 py-2 rounded-t-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <span className="font-medium whitespace-nowrap">
              {isCreatePostOpen ? 'Cerrar formulario' : 'Crear Nueva Publicación'}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isCreatePostOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto flex flex-col gap-3 p-4">
            <div className="flex flex-col">
              <input
                placeholder="Título"
                value={newPost.title}
                onChange={(e) => {
                  setTitleError(false);
                  setNewPost({ ...newPost, title: e.target.value });
                }}
                className={`border-2 ${
                  titleError ? 'border-red-500' : 'border-blue-200'
                } p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white w-full text-black placeholder-gray-500 break-words whitespace-pre-wrap overflow-hidden`}
              />
              {titleError && (
                <span className="text-red-500 text-sm mt-1">
                  El título no puede estar vacío
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <textarea
                placeholder="Descripción"
                value={newPost.description}
                onChange={(e) => {
                  setDescriptionError(false);
                  setNewPost({ ...newPost, description: e.target.value });
                }}
                className={`border-2 ${
                  descriptionError ? 'border-red-500' : 'border-blue-200'
                } p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white w-full text-black placeholder-gray-500 break-words whitespace-pre-wrap overflow-hidden`}
                rows={3}
              />
              {descriptionError && (
                <span className="text-red-500 text-sm mt-1">
                  La descripción no puede estar vacía
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex-1">
                <div className="bg-blue-600 text-white p-3 rounded-lg text-center cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {uploading ? 'Subiendo...' : 'Subir Imágenes'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                  ref={fileInputRef}
                  multiple // Enable multiple file selection
                />
              </label>
              <button 
                onClick={handleSubmit}
                disabled={uploading}
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 active:bg-green-800 transition-colors shadow-sm hover:shadow-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Post
              </button>
            </div>
            
            {/* Preview for multiple images */}
            {newPost.imageUrls && newPost.imageUrls.length > 0 && (
              <div className="mt-2 relative w-full">
                {newPost.imageUrls.length === 1 ? (
                  <div className="relative">
                    <img 
                      src={newPost.imageUrls[0]} 
                      alt="Preview" 
                      className="w-full h-auto max-h-[200px] object-contain rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => setNewPost(prev => ({ ...prev, imageUrls: [] }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                      <div className="flex">
                        {newPost.imageUrls.map((url, index) => (
                          <div key={index} className="flex-[0_0_100%] min-w-0">
                            <img 
                              src={url} 
                              alt={`Preview ${index + 1}`}
                              className="w-full h-auto max-h-[200px] object-contain rounded-lg bg-gray-50"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center gap-2 mt-2">
                        {newPost.imageUrls.map((_, index) => (
                          <button
                            key={index}
                            className="w-2 h-2 rounded-full bg-blue-300"
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setNewPost(prev => ({ ...prev, imageUrls: [] }))}
                      className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Expanded view"
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SOS Valencia",
            "url": "https://sosvalencia.com",
            "description": "Plataforma de ayuda para afectados por la DANA e inundaciones en Valencia",
            "keywords": "DANA Valencia, inundaciones, ayuda, emergencias, temporal",
          })
        }}
      />
    </main>
  );
}
