// src/app/page.tsx
"use client"; // Add this line to make this a client component

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrls?: string[]; // Changed from imageUrl to imageUrls array
  comments: {
    text: string;
    createdAt: Date;
  }[];
}

// Add these SVG components at the top of your file
const ChevronLeftIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

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
  const [isEmergencyExpanded, setIsEmergencyExpanded] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-white w-full pb-[200px]">
      <div className="max-w-4xl mx-auto px-4 pb-96 bg-white pt-0 mt-0">
        <h1 className="text-4xl font-bold text-center py-6 text-blue-700 bg-white">SOS Valencia</h1>
        
        {/* Add Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar publicaciones..."
              className="w-full px-4 py-3 pl-10 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
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
        </div>

        {/* Emergency Information Card */}
        <div className="bg-red-50 border-2 border-red-500 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold text-red-700 p-4">⚠️ Información de Emergencia</h2>
          
          <button 
            onClick={() => setIsEmergencyExpanded(!isEmergencyExpanded)}
            className="w-full px-4 pb-2 flex justify-end items-center text-left hover:bg-red-100/50 transition-colors"
            aria-expanded={isEmergencyExpanded}
          >
            <span className="text-red-700 text-sm mr-2">
              {isEmergencyExpanded ? 'Ocultar información' : 'Mostrar información'}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`w-5 h-5 text-red-700 transition-transform duration-200 ${
                isEmergencyExpanded ? 'rotate-180' : ''
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

          <div 
            className={`transition-all duration-200 ease-in-out ${
              isEmergencyExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-6 pb-6">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-red-800">Números de Emergencia:</h3>
                  <ul className="list-disc list-inside ml-4 text-red-700">
                    <li>Emergencias: 112</li>
                    <li>Personas desaparecidas: 900 365 112</li>
                  </ul>
                </div>


                <div className="bg-red-100 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold text-red-800">Recomendaciones:</h3>
                  <ul className="list-disc list-inside ml-4 text-red-700">
                    <li>Evite coger el coche y salir de casa</li>
                    <li>Tenga preparado un kit de emergencia</li>
                    <li>Siga las instrucciones de las autoridades</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Posts */}
        <div className="space-y-6 mb-20">
          {filteredPosts.map((post) => {
            console.log('Rendering post:', post);
            
            return (
              <div key={post._id} className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full">
                <Link 
                  href={`/posts/${post._id}`} 
                  prefetch={true}
                  className="text-2xl font-semibold text-blue-800 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <h2>{post.title}</h2>
                </Link>
                
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="mt-4 w-full">
                    {post.imageUrls.length === 1 ? (
                      <img 
                        src={post.imageUrls[0]} 
                        alt={post.title} 
                        className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-gray-50"
                      />
                    ) : (
                      <div className="relative mt-4 w-full">
                        <div className="overflow-hidden" ref={emblaRef}>
                          <div className="flex">
                            {post.imageUrls.map((url, index) => (
                              <div key={index} className="flex-[0_0_100%] min-w-0">
                                <img 
                                  src={url} 
                                  alt={`${post.title} - ${index + 1}`}
                                  className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-gray-50"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                          onClick={() => emblaApi?.scrollPrev()}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                          aria-label="Previous image"
                        >
                          <ChevronLeftIcon />
                        </button>

                        <button
                          onClick={() => emblaApi?.scrollNext()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                          aria-label="Next image"
                        >
                          <ChevronRightIcon />
                        </button>

                        {/* Dots indicator */}
                        <div className="flex justify-center gap-2 mt-2">
                          {post.imageUrls.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => emblaApi?.scrollTo(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentSlide ? 'bg-blue-600 w-4' : 'bg-blue-300'
                              }`}
                              aria-label={`Go to slide ${index + 1}`}
                              aria-current={index === currentSlide ? 'true' : 'false'}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{post.description}</p>

                {/* Comments Section */}
                <div className="mt-6 border-t border-blue-100 pt-4">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3">Comentarios</h3>
                  
                  {/* Comment Form */}
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;
                      
                      if (!comment.trim()) return;

                      try {
                        const res = await fetch(`/api/posts/${post._id}/comments`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ text: comment }),
                        });

                        if (res.ok) {
                          const updatedPost = await res.json();
                          setPosts(posts.map(p => p._id === post._id ? updatedPost : p));
                          form.reset();
                        }
                      } catch (error) {
                        console.error('Error posting comment:', error);
                      }
                    }}
                    className="mb-4"
                  >
                    <textarea
                      name="comment"
                      placeholder="Escribe un comentario..."
                      className="w-full p-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
                      rows={2}
                      required
                    />
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Comentar
                    </button>
                  </form>

                  {/* Comments Display */}
                  <div className="space-y-3">
                    {post.comments.slice(0, 2).map((comment, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg">
                        <p className="!text-black font-normal">{comment.text}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    
                    {post.comments.length > 2 && (
                      <Link
                        href={`/posts/${post._id}`}
                        prefetch={true}
                        className="block text-blue-600 hover:text-blue-800 font-medium mt-2"
                      >
                        Ver más comentarios ({post.comments.length - 2} más)
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible Create Post Form */}
      <div className={`fixed bottom-0 left-0 right-0 bg-gray-100 border-t-2 border-blue-200 shadow-lg w-full transition-transform duration-300 ${
        isCreatePostOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCreatePostOpen(!isCreatePostOpen)}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-t-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <span className="font-medium">
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

        {/* Your existing form content */}
        <div className="max-w-4xl mx-auto flex flex-col gap-3 p-4">
          <input
            placeholder="Título"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white w-full text-black placeholder-gray-500"
          />
          <textarea
            placeholder="Descripción"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            className="border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white w-full text-black placeholder-gray-500"
            rows={3}
          />
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
    </main>
  );
}
