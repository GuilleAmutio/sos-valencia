import { useState } from 'react';
import Link from 'next/link';
import { processTextWithLinks } from '@/utils/linkUtils';
import ImageCarousel from './ImageCarousel';
import ImageModal from './ImageModal';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

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

interface PostCardProps {
  post: Post;
  commentText: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (comment: string) => Promise<void>;
}

export default function PostCard({ post, commentText, onCommentChange, onCommentSubmit }: PostCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div 
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

      {/* Image carousel */}
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
        
        <CommentForm
          value={commentText}
          onChange={onCommentChange}
          onSubmit={onCommentSubmit}
          className="mt-4"
        />

        <CommentList 
          comments={post.comments} 
          postId={post._id} 
          preview={true} 
        />
      </div>

      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
} 