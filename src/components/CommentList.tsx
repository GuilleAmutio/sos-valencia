import { processTextWithLinks } from '@/utils/linkUtils';
import Link from 'next/link';

interface Comment {
  text: string;
  createdAt: Date;
}

interface CommentListProps {
  comments: Comment[];
  postId?: string;
  preview?: boolean;
}

export default function CommentList({ comments, postId, preview = false }: CommentListProps) {
  // If preview is true, only show last 2 comments
  const displayComments = preview ? comments.slice(-2) : comments;

  return (
    <div className="space-y-3">
      {displayComments.map((comment, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-700 break-words whitespace-pre-wrap overflow-hidden">
            {processTextWithLinks(comment.text)}
          </p>
          <span className="text-sm text-gray-500 mt-1 block">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
      
      {/* "Ver más" link if in preview mode and there are more than 2 comments */}
      {preview && comments.length > 2 && postId && (
        <Link 
          href={`/posts/${postId}`}
          className="block mt-3 text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver todos los comentarios ({comments.length})
        </Link>
      )}
    </div>
  );
} 