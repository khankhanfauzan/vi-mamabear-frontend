import React from "react";
import { Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  promoCode: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  promoCode,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in relative">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Hapus Promo</h3>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus kode promo{" "}
          <span className="font-semibold text-gray-900">&quot;{promoCode}&quot;</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 min-w-[100px]"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
