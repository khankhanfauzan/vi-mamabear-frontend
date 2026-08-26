import React from "react";
import { Search, Filter, ChevronDown, ChevronUp, Download, Loader2 } from "lucide-react";
import type { Category } from "@/features/categories/types/category.types";

export interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  resetFilters: () => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  initialCategories: Category[];
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  inStock: string;
  setInStock: (value: string) => void;
  isActive: string;
  setIsActive: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  onExport: () => void;
  isExporting: boolean;
}

/**
 * ProductFilters
 * Presentational component displaying search inputs, expandable advanced filters,
 * and the newly added CSV Export button.
 */
export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  resetFilters,
  selectedCategory,
  setSelectedCategory,
  initialCategories,
  showFilters,
  setShowFilters,
  inStock,
  setInStock,
  isActive,
  setIsActive,
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onExport,
  isExporting,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={resetFilters}
            onFocus={resetFilters}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] transition-all text-font-2"
          />
        </div>

        <div className="flex w-full md:w-auto flex-wrap gap-3 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:w-[200px] px-4 py-2.5 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] text-font-2 text-[var(--color-gray)]"
          >
            <option value="all">Semua Kategori</option>
            {initialCategories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
          
          <button 
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 border rounded-md flex items-center gap-2 font-medium transition-colors ${showFilters ? 'bg-[var(--mama-cream)] border-[var(--mama-hot-pink)] text-[var(--mama-hot-pink)]' : 'bg-white border-gray-200 hover:bg-gray-50 text-[var(--color-gray)]'}`}
          >
            <Filter className="w-4 h-4" />
            Filter Lanjutan
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="px-4 py-2.5 border border-emerald-200 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Ekspor CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--color-gray)]">Status Produk</label>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] text-font-1 text-[var(--color-gray)] bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="true">Aktif (Tampil)</option>
              <option value="false">Draf (Sembunyi)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--color-gray)]">Status Stok</label>
            <select
              value={inStock}
              onChange={(e) => setInStock(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] text-font-1 text-[var(--color-gray)] bg-white"
            >
              <option value="all">Semua Stok</option>
              <option value="true">Tersedia</option>
              <option value="false">Habis</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--color-gray)]">Urutkan</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] text-font-1 text-[var(--color-gray)] bg-white"
            >
              <option value="createdAt-desc">Terbaru</option>
              <option value="totalSold-desc">Paling Laris</option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
              <option value="name-asc">Nama: A - Z</option>
              <option value="name-desc">Nama: Z - A</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--color-gray)]">Harga Minimum (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] text-font-1 bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--color-gray)]">Harga Maksimum (Rp)</label>
            <input
              type="number"
              placeholder="Tak Terhingga"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] focus:border-[var(--mama-hot-pink)] text-font-1 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}