"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { processTextWithLinks } from '@/utils/linkUtils';
import Image from 'next/image';
import ImageCarousel from '@/components/ImageCarousel';
import ImageModal from '@/components/ImageModal';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import PostDetail from '@/components/PostDetail';

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
interface PostContentProps {
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post | null>>;
}

const PostContent = ({ post, setPost }: PostContentProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [comment, setComment] = useState('');

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
        <CommentForm
          value={comment}
          onChange={(value) => setComment(value)}
          onSubmit={async (comment) => {
            try {
              const res = await fetch(`/api/posts/${post._id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: comment }),
              });

              if (res.ok) {
                setComment('');
                // Refresh post data
                const refreshRes = await fetch(`/api/posts/${post._id}`);
                const refreshedPost = await refreshRes.json();
                setPost(refreshedPost);
              }
            } catch (error) {
              console.error('Error posting comment:', error);
            }
          }}
          className="mb-8"
        />

        <CommentList 
          comments={post.comments}
        />
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
    <>
      <Link 
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← Volver
      </Link>

      <Suspense fallback={<LoadingPost />}>
      {post ? (
          <div className="mb-8">
            <PostDetail post={post} setPost={setPost} />
          </div>
        ) : (
          <LoadingPost />
        )}
      </Suspense>
    </>
  );
}