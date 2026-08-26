import { Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  categoryName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  categoryName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-font-4 font-bold text-red-600 mb-2">
            Hapus Kategori
          </h3>
          <p className="text-font-2 text-[var(--color-gray)] leading-relaxed">
            Apakah Anda yakin ingin menghapus kategori {" "}
            <span className="font-semibold text-[var(--mama-brown)]">
              {categoryName}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md font-semibold text-[var(--color-gray)] bg-white border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus Kategori"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};