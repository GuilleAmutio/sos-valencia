"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { processTextWithLinks } from '@/utils/linkUtils';
import Image from 'next/image';
import Header from '@/components/Header';
import ImageCarousel from '@/components/ImageCarousel';
import ImageModal from '@/components/ImageModal';

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
      <h1 className="text-2xl font-bold text-gray-900 mb-4 break-words whitespace-pre-wrap overflow-hidden">
        {post.title}
      </h1>

      {/* Images Carousel */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <ImageCarousel 
          images={post.imageUrls} 
          onImageClick={(url) => setSelectedImage(url)}
          className="mb-6"
        />
      )}

      {/* Image Modal */}
      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />

      {/* Description */}
      <p className="text-gray-700 whitespace-pre-wrap mb-6 break-words overflow-hidden">
        {processTextWithLinks(post.description)}
      </p>

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
            className="w-full p-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black break-words whitespace-pre-wrap overflow-hidden"
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
              <p className="text-gray-700 break-words whitespace-pre-wrap overflow-hidden">
                {processTextWithLinks(comment.text)}
              </p>
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
    <main className="min-h-screen bg-white w-full pb-[200px]">
      <div className="max-w-4xl mx-auto px-4 pb-96 bg-white pt-0 mt-0">
        <Header />

        {/* Back button and post content */}
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