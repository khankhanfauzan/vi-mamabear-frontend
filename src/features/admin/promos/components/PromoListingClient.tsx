"use client";
import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPromoTable } from "./AdminPromoTable";
import { AdminPromoPagination } from "./AdminPromoPagination";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { usePromoList } from "../hooks/usePromoList";

export const PromoListingClient = () => {
  const {
    promos,
    isLoading,
    error,
    promoToDelete,
    isDeleting,
    page,
    totalPages,
    setPage,
    initiateDelete,
    cancelDelete,
    confirmDelete,
  } = usePromoList();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
            Manajemen Promo
          </h1>
          <p className="text-[var(--color-gray)] mt-1">
            Kelola kode promo dan diskon untuk pelanggan.
          </p>
        </div>
        <Link
          href="/admin/promos/create"
          className="flex items-center gap-2 bg-[var(--mama-hot-pink)] text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Tambah Promo
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={promoToDelete !== null}
        promoCode={promoToDelete?.code || ""}
        isDeleting={isDeleting}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <AdminPromoTable
        promos={promos}
        isLoading={isLoading}
        onDelete={initiateDelete}
      />

      {/* Pagination */}
      {!isLoading && (
        <AdminPromoPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
