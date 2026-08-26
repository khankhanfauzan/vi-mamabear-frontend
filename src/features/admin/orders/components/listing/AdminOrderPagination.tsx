"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminOrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AdminOrderPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AdminOrderPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4 bg-white">
      <span className="text-sm text-[var(--color-light-gray)]">
        Menampilkan halaman {currentPage} dari {totalPages}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        <button className="flex items-center justify-center w-8 h-8 bg-[var(--mama-pink)] text-[var(--mama-brown)] border border-[var(--mama-pink)] rounded-lg text-sm font-bold">
          {currentPage}
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
