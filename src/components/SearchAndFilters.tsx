interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (value: 'newest' | 'oldest') => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  setCurrentPage: (page: number) => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  setCurrentPage
}: SearchAndFiltersProps) {
  return (
    <div className="pb-4">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-4">
          {/* Search bar with icon */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm text-black"
            />
            <svg
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                searchTerm ? 'text-blue-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Sort filter */}
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
            className="p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </select>
        </div>

        {/* Items per page selector */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border-2 border-gray-200 rounded-lg px-2 py-1 text-black focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {[5, 10, 20, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span className="text-gray-600">por página</span>
          </div>

          {/* Total items count */}
          <div className="text-gray-600">
            Total: {totalItems} publicaciones
          </div>
        </div>
      </div>
    </div>
  );
} 