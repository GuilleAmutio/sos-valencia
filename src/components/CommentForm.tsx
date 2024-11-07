import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CommentForm({ onSubmit, value, onChange, className = '' }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(value);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <textarea
        placeholder="Escribe un comentario..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm resize-none text-black"
        rows={3}
        disabled={isSubmitting}
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !value.trim()}
        className={`mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Enviando...</span>
          </div>
        ) : (
          'Comentar'
        )}
      </button>
    </div>
  );
} 