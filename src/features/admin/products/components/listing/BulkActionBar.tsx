import React from "react";
import { Loader2, Eye, EyeOff, Trash2 } from "lucide-react";

export interface BulkActionsBarProps {
  selectedCount: number;
  isBulkProcessing: boolean;
  bulkError: string | null;
  onPublish: () => void;
  onUnpublish: () => void;
  onDeletePrompt: () => void;
}

/**
 * BulkActionsBar
 * Controls bulk edits (publishing status & deletions) when checkboxes are ticked.
 */
export default function BulkActionsBar({
  selectedCount,
  isBulkProcessing,
  bulkError,
  onPublish,
  onUnpublish,
  onDeletePrompt,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[var(--mama-pink)]/20 border border-[var(--mama-pink)] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-[var(--mama-brown)] text-font-2">
          {selectedCount} produk terpilih
        </span>
        {isBulkProcessing && (
          <Loader2 className="w-4 h-4 animate-spin text-[var(--mama-hot-pink)]" />
        )}
        {bulkError && (
          <span className="text-red-500 text-sm font-medium">{bulkError}</span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPublish}
          disabled={isBulkProcessing}
          className="px-4 py-2 bg-white border border-gray-200 rounded-md text-[var(--color-gray)] hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
        >
          <Eye className="w-4 h-4" /> Terbitkan
        </button>
        <button
          type="button"
          onClick={onUnpublish}
          disabled={isBulkProcessing}
          className="px-4 py-2 bg-white border border-gray-200 rounded-md text-[var(--color-gray)] hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
        >
          <EyeOff className="w-4 h-4" /> Jadikan Draf
        </button>
        <button
          type="button"
          onClick={onDeletePrompt}
          disabled={isBulkProcessing}
          className="px-4 py-2 bg-white border border-red-200 rounded-md text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" /> Hapus
        </button>
      </div>
    </div>
  );
}
