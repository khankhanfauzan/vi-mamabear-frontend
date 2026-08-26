"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

interface CustomerStatusManagerProps {
  currentStatus: boolean;
  isUpdating: boolean;
  error: string | null;
  onUpdateStatus: (newStatus: boolean) => void;
}

export function CustomerStatusManager({
  currentStatus,
  isUpdating,
  error,
  onUpdateStatus,
}: CustomerStatusManagerProps) {
  // Safely fallback to false if currentStatus is undefined or null
  const [selectedStatus, setSelectedStatus] = useState<boolean>(
    () => !!currentStatus,
  );

  // Keep state synchronized if currentStatus changes dynamically from the parent component
  useEffect(() => {
    setSelectedStatus(!!currentStatus);
  }, [currentStatus]);

  const hasChanged = selectedStatus !== !!currentStatus;

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-[var(--mama-hot-pink)]" />
        <h2 className="text-font-4 font-bold text-[var(--mama-brown)]">
          Status Akun
        </h2>
      </div>

      <p className="text-font-2 text-gray-500 mb-4">
        Perbarui status blokir akun pelanggan ini. Akun yang diblokir akan
        dibatasi dari membuat pesanan baru dan fitur lainnya.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-font-1">
          {error}
        </div>
      )}

      {}
      <select
        value={String(selectedStatus)}
        onChange={(e) => setSelectedStatus(e.target.value === "true")}
        disabled={isUpdating}
        className="w-full p-3 text-font-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] mb-4 bg-white disabled:opacity-50"
      >
        <option value="false">Aktif (Tidak Diblokir)</option>
        <option value="true">Diblokir (Terbatas)</option>
      </select>

      <button
        onClick={() => onUpdateStatus(selectedStatus)}
        disabled={!hasChanged || isUpdating}
        className={`mt-auto w-full py-3 rounded-md font-semibold text-font-3 transition-colors ${
          !hasChanged || isUpdating
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-[var(--mama-hot-pink)] text-white hover:bg-opacity-90 shadow-sm"
        }`}
      >
        {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}
