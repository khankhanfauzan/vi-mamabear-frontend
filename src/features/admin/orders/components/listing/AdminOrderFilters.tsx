"use client";

import React from "react";
import {
  Search,
  Download,
  ChevronDown,
  ArrowDownUp,
  Calendar,
} from "lucide-react";
import { ORDER_STATUS_OPTIONS } from "@/features/admin/orders/utils/orderStatus";

interface AdminOrderFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  currentStatus: string;
  sortBy: string;
  sortOrder: string;
  startDate: string;
  endDate: string;
  // Updated signature to accept string pairs OR objects for batching
  updateUrlParams: (keyOrUpdates: string | Record<string, string>, value?: string) => void;
  onExport: () => void;
  isExporting: boolean;
}

export function AdminOrderFilters({
  searchInput,
  setSearchInput,
  currentStatus,
  sortBy,
  sortOrder,
  startDate,
  endDate,
  updateUrlParams,
  onExport,
  isExporting,
}: AdminOrderFiltersProps) {
  
  // Combine the values directly. The default fallback will be handled by the 
  // initial state defined in the hook to match the <option> values perfectly.
  const currentSortValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-4">
      {/* Top Row: Search & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-light-gray)]" />
          <input
            type="text"
            placeholder="Cari ID pesanan, nama pelanggan, atau email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-font-2 md:text-font-2 focus:outline-none focus:ring-2 focus:ring-[var(--mama-hot-pink)]"
          />
        </div>

        <button 
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-font-2 font-medium hover:bg-gray-50 transition-colors w-full md:w-auto justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-[var(--color-gray)] border-t-transparent rounded-full animate-spin" />
              Mengekspor...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Ekspor CSV
            </>
          )}
        </button>
      </div>

      {/* Bottom Row: Filters & Sorting */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="relative flex-1 md:flex-none min-w-[200px]">
          <select
            value={currentStatus}
            onChange={(e) => updateUrlParams("status", e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--mama-hot-pink)] cursor-pointer appearance-none"
          >
            <option value="ALL">Semua Status</option>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-light-gray)] pointer-events-none" />
        </div>

        {/* Sort By */}
        <div className="relative flex-1 md:flex-none min-w-[160px]">
          <select
            value={currentSortValue}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              // We pass an object to batch the updates, preventing URL race conditions
              updateUrlParams({ sortBy: newSortBy, sortOrder: newSortOrder });
            }}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--mama-hot-pink)] cursor-pointer appearance-none"
          >
            <option value="createdAt-desc">Terbaru</option>
            <option value="createdAt-asc">Terlama</option>
            <option value="total-desc">Total Tertinggi</option>
            <option value="total-asc">Total Terendah</option>
            <option value="status-asc">Status (A-Z)</option>
          </select>
          <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-light-gray)] pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-light-gray)] pointer-events-none" />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-light-gray)] pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => updateUrlParams("startDate", e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--mama-hot-pink)]"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-light-gray)] pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => updateUrlParams("endDate", e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--mama-hot-pink)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}