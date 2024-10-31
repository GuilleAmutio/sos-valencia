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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  return (
    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">{post.title}</h1>
      
      {/* Images Carousel */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="relative mt-4 w-full mb-6">
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
        </div>
      )}

      {/* Description */}
      <p className="text-black whitespace-pre-wrap mb-8">{post.description}</p>

      {/* Comments Section */}
      <div className="mt-8 border-t border-blue-100 pt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
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
                const updatedPost = await res.json();
                // You'll need to implement setPost in the parent component
                // setPost(updatedPost);
                form.reset();
                window.location.reload(); // Temporary solution to refresh comments
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
            className="w-full p-4 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
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
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-black">{comment.text}</p>
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