"use client";

import { PaginationMeta } from "@/features/admin/customers/types/customer.types";
import React from "react";

interface CustomerPaginationProps {
  pagination: PaginationMeta;
  isPending: boolean;
  goToPage: (page: number) => void;
}

export function CustomerPagination({
  pagination,
  isPending,
  goToPage,
}: CustomerPaginationProps) {
  const startItem =
    pagination.totalItems === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.totalItems,
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
    const end = Math.min(pagination.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:px-6 border-t border-gray-100 gap-4 text-gray-500 text-font-2 md:text-font-2 bg-white">
      <span>
        Menampilkan {startItem}-{endItem} dari {pagination.totalItems} pelanggan
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(pagination.page - 1)}
          disabled={!pagination.hasPrevPage || isPending}
          className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white font-medium text-[var(--mama-brown)] transition-colors"
        >
          Sebelumnya
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            disabled={isPending}
            className={`w-10 h-10 flex items-center justify-center rounded-md border transition-colors ${
              pagination.page === p
                ? "border-[var(--mama-hot-pink)] text-[var(--mama-hot-pink)] font-semibold bg-pink-50"
                : "border-gray-200 hover:bg-gray-50 text-[var(--mama-brown)] bg-white"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => goToPage(pagination.page + 1)}
          disabled={!pagination.hasNextPage || isPending}
          className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white font-medium text-[var(--mama-brown)] transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
