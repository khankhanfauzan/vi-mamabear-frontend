"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface CustomerFiltersProps {
  onFilterChange: (key: string, value: string) => void;
  onExport: () => void;
  isExporting: boolean;
  isPending: boolean;
}

export function CustomerFilters({ onFilterChange, onExport, isExporting, isPending }: CustomerFiltersProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('isBlocked') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== initialSearch) {
        onFilterChange('search', searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, initialSearch, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-font-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-colors"
        />
      </div>
      
      <div className="flex w-full md:w-auto items-center gap-3">
        <select
          value={initialStatus}
          onChange={(e) => onFilterChange('isBlocked', e.target.value)}
          disabled={isPending}
          className="w-full md:w-auto px-4 py-2 text-font-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] bg-white disabled:opacity-50"
        >
          <option value="">Semua Status</option>
          <option value="false">Aktif</option>
          <option value="true">Diblokir</option>
        </select>
        
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-font-2 font-medium text-[var(--mama-brown)] bg-[var(--mama-cream)] hover:bg-[var(--mama-pink)] rounded-md transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Mengekspor...' : 'Ekspor CSV'}
        </button>
      </div>
    </div>
  );
}