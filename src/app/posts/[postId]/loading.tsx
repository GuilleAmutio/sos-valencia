export default function Loading() {
  return (
    <main className="min-h-screen bg-white py-8">
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
    </main>
  );
} 