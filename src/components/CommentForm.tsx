interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CommentForm({ onSubmit, value, onChange, className = '' }: CommentFormProps) {
  return (
    <div className={className}>
      <textarea
        placeholder="Escribe un comentario..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm resize-none text-black"
        rows={3}
      />
      <button
        onClick={async () => {
          if (!value.trim()) return;
          await onSubmit(value);
        }}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
      >
        Comentar
      </button>
    </div>
  );
} 