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
import ImageModal from '@/components/ImageModal';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import PostCard from '@/components/PostCard';
import SearchAndFilters from '@/components/SearchAndFilters';
import PaginationControls from '@/components/PaginationControls';

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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
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

    // Validation
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
      
      // Reset form
      setNewPost({ title: '', description: '', imageUrls: [] });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh posts
      const refreshRes = await fetch('/api/posts');
      const refreshedPosts = await refreshRes.json();
      setPosts(refreshedPosts);
      
      // Collapse the form
      setIsCreatePostOpen(false);

      // Set page to 1 if sorting by newest (post will appear at the top)
      // Or last page if sorting by oldest (post will appear at the bottom)
      if (sortOrder === 'newest') {
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const newTotalPages = Math.ceil((refreshedPosts.length) / itemsPerPage);
        setCurrentPage(newTotalPages);
        // Give a small delay to allow the page to update before scrolling
        setTimeout(() => {
          window.scrollTo({ 
            top: document.documentElement.scrollHeight,
            behavior: 'smooth' 
          });
        }, 100);
      }
      
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
    <>
      <SearchAndFilters
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={(value) => setSortOrder(value)}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        totalItems={filteredAndSortedPosts.length}
        setCurrentPage={setCurrentPage}
      />

      {/* Posts list */}
      <div className="space-y-6 mb-2">
        {currentPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            commentText={commentTexts[post._id] || ''}
            onCommentChange={(value) => setCommentTexts(prev => ({
              ...prev,
              [post._id]: value
            }))}
            onCommentSubmit={async (comment) => {
              try {
                const res = await fetch(`/api/posts/${post._id}/comments`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: comment }),
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
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mb-6">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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

      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />

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
      
    </>
  );
}
