/**
 * @fileoverview Pagination - Page navigation with prev/next and page numbers.
 */

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const baseBtn = 'min-w-[40px] h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`${baseBtn} bg-bg-card border border-border-light text-text-secondary
                    hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-light disabled:hover:text-text-secondary`}
        aria-label="Previous page"
      >
        <FiChevronLeft size={18} />
      </button>

      {getPageNumbers().map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-text-muted">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${baseBtn} border ${
              p === page
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                : 'bg-bg-card text-text-secondary border-border-light hover:border-primary hover:text-primary'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`${baseBtn} bg-bg-card border border-border-light text-text-secondary
                    hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-light disabled:hover:text-text-secondary`}
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
}
