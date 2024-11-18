import { PaginationProps } from "../../types";

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="bg-gray-600 px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="bg-gray-600 px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
);
  
export default Pagination;