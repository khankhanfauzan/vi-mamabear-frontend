import { ProductFormValues } from "@/features/admin/products/types/product.types";
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface StatusSidebarProps {
  register: UseFormRegister<ProductFormValues>;
  isLoading: boolean;
  isEditMode?: boolean;
  onCancel: () => void;
}

/**
 * ProductStatusSidebar
 * Sidebar control panel supporting publication status switching and submission/dismissal triggers.
 */
export default function ProductStatusSidebar({
  register,
  isLoading,
  isEditMode = false,
  onCancel,
}: StatusSidebarProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-6">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-4">
        Status
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Status Publikasi
          </label>
          <select
            {...register("isActive")}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)] bg-white"
          >
            <option value="false">Draf</option>
            <option value="true">Aktif</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--mama-hot-pink)] text-white py-2 rounded-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading
              ? "Menyimpan..."
              : isEditMode
                ? "Simpan Perubahan"
                : "Buat Produk"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
