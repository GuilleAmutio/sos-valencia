import { useState } from 'react';
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

interface PostDetailProps {
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post | null>>;
}

export default function PostDetail({ post, setPost }: PostDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  return (
    <div className="bg-gray-100 border border-gray-200 p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 break-words whitespace-pre-wrap overflow-hidden">
        {post.title}
      </h1>

      {post.imageUrls && (
        <ImageCarousel 
          images={post.imageUrls} 
          onImageClick={(url) => setSelectedImage(url)}
          className="mb-6"
        />
      )}

      <p className="text-gray-700 whitespace-pre-wrap mb-6 break-words overflow-hidden">
        {processTextWithLinks(post.description)}
      </p>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Comentarios ({post.comments.length})
        </h2>

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

      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
} 