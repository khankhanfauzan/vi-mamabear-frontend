"use client";

import React from 'react';
import { Download } from 'lucide-react';
import { Category } from '@/features/categories/types/category.types';

interface DashboardHeaderProps {
  period: 'daily' | 'weekly' | 'monthly';
  setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  categoryId?: number;
  setCategoryId?: (id: number | undefined) => void;
  categories?: Category[];
  handleExport: () => void;
  isExporting: boolean;
}

export function DashboardHeader({ 
  period, 
  setPeriod, 
  categoryId,
  setCategoryId,
  categories,
  handleExport, 
  isExporting 
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">Laporan & Analitik</h1>
        <p className="text-font-2 text-gray-500">Wawasan terperinci tentang performa toko Anda</p>
      </div>
      <div className="flex items-center gap-3">
        {categories && setCategoryId && (
          <select 
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] cursor-pointer"
        >
          <option value="daily">Hari Ini</option>
          <option value="weekly">7 Hari Terakhir</option>
          <option value="monthly">30 Hari Terakhir</option>
        </select>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Mengunduh...' : 'Unduh Laporan'}
        </button>
      </div>
    </div>
  );
}