import { Fragment } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPageOptions: number[];
}

export default function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions
}: PaginationControlsProps) {
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const indexOfFirstItem = indexOfLastItem - Math.min(itemsPerPage, indexOfLastItem - ((currentPage - 1) * itemsPerPage));

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md border border-blue-100 mt-8">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Mostrar:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-gray-600">por página</span>
      </div>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
        >
          ←
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            return page === 1 || 
                   page === totalPages || 
                   Math.abs(page - currentPage) <= 1;
          })
          .map((page, index, array) => {
            if (index > 0 && page - array[index - 1] > 1) {
              return (
                <Fragment key={`ellipsis-${page}`}>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {page}
                  </button>
                </Fragment>
              );
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {page}
              </button>
            );
          })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100"
        >
          →
        </button>
      </div>

      {/* Posts count */}
      <div className="text-gray-600">
        Mostrando {indexOfFirstItem + 1}-{indexOfLastItem} de {totalItems}
      </div>
    </div>
  );
} 