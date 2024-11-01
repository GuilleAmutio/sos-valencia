"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  imageUrls?: string[];
  comments: {
    text: string;
    createdAt: Date;
  }[];
}

// Post content component with all the details
const PostContent = ({ post }: { post: Post }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-gray-100 border border-gray-200 p-6 rounded-xl shadow-md">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

      {/* Images Carousel */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="relative w-full mb-6">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {post.imageUrls.map((url, index) => (
                <div key={index} className="relative flex-[0_0_100%]">
                  <img 
                    src={url} 
                    alt={`${post.title} - ${index + 1}`}
                    className="w-full h-[250px] object-contain bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => setSelectedImage(url)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          {post.imageUrls.length > 1 && (
            <>
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
                aria-label="Previous image"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-6 h-6 text-gray-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
                aria-label="Next image"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-6 h-6 text-gray-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Image Modal */}
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

      {/* Description */}
      <p className="text-gray-700 whitespace-pre-wrap mb-6">{post.description}</p>

      {/* Comments Section */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Comentarios ({post.comments.length})
        </h2>

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
                form.reset();
                window.location.reload();
              }
            } catch (error) {
              console.error('Error posting comment:', error);
            }
          }}
          className="mb-8"
        >
          <textarea
            name="comment"
            placeholder="Escribe un comentario..."
            className="w-full p-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
            rows={3}
            required
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comentar
          </button>
        </form>

        {/* Comments Display */}
        <div className="space-y-4">
          {post.comments.map((comment, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{comment.text}</p>
              <span className="text-sm text-gray-500 mt-2 block">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading component
const LoadingPost = () => (
  <div className="max-w-4xl mx-auto px-4 animate-pulse">
    <div className="h-8 w-24 bg-gray-200 rounded mb-6"></div>
    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-md">
      <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
      <div className="h-64 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with ID:', postId); // Debug log
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        console.log('Received post data:', data); // Debug log
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Volver
        </Link>

        <Suspense fallback={<LoadingPost />}>
          {post ? <PostContent post={post} /> : <LoadingPost />}
        </Suspense>
      </div>
    </main>
  );
}