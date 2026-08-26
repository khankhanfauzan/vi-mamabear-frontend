import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedCount: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

/**
 * PaginationFooter
 * Standard numbered pagination footer matching updated API specifications.
 */
export default function PaginationFooter({
  currentPage,
  totalPages,
  totalItems,
  selectedCount,
  isLoading,
  onPageChange,
}: PaginationFooterProps) {
  // Render sequential page buttons
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = Math.max(1, totalPages);

    for (let i = 1; i <= maxPagesToShow; i++) {
      pages.push(
        <button
          key={i}
          type="button"
          onClick={() => onPageChange(i)}
          disabled={isLoading || currentPage === i}
          className={`px-3 py-1.5 border rounded-md text-font-1 transition-colors min-w-[32px] ${
            currentPage === i
              ? "bg-[var(--mama-hot-pink)] text-white border-[var(--mama-hot-pink)] font-medium shadow-sm"
              : "bg-white border-gray-200 text-[var(--color-gray)] hover:bg-gray-50 disabled:opacity-50"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="p-4 border-t border-[var(--color-light-gray)]/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
      <span className="text-[var(--color-gray)] text-font-1">
        Menampilkan {totalItems} produk
        {selectedCount > 0 && ` (${selectedCount} dipilih)`}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="px-3 py-1.5 border border-gray-200 rounded-md text-font-1 text-[var(--color-gray)] bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-2">
          {renderPageNumbers()}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="px-3 py-1.5 border border-gray-200 rounded-md text-font-1 text-[var(--color-gray)] bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center"
        >
          Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
