import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  selectedCount: number;
}

/**
 * DeleteConfirmModal
 * Elegant, localized overlay modal that acts as a secure, non-disruptive native alert replacement.
 */
export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  selectedCount,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
        </div>
        <p className="text-[var(--color-gray)] mb-6 text-font-2">
          Apakah Anda yakin ingin menghapus <strong>{selectedCount}</strong>{" "}
          produk yang terpilih? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-[var(--color-gray)] bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
