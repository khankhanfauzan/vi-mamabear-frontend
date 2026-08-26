"use client";

import ProductCard from "@/features/products/components/shared/ProductCard";
import { useSearchResults } from "@/features/products/hooks/useSearchResults";
import { AlertCircle, PackageX } from "lucide-react";

export function SearchResults() {
  const { query, products, isLoading, error } = useSearchResults();

  // Handle empty query state
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageX className="w-16 h-16 text-[var(--color-light-gray)] mb-4" />
        <h2 className="text-xl font-bold text-[var(--mama-brown)] mb-2 text-font-1">
          Mulai Pencarian
        </h2>
        <p className="text-[var(--color-gray)] text-font-2">
          Silakan ketik nama produk yang ingin Anda cari.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-[var(--color-gray)] text-font-2 mt-1">
          Menampilkan hasil untuk:{" "}
          <span className="font-semibold text-black">&quot;{query}&quot;</span>
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50 rounded-xl border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <p className="text-red-700 font-medium text-font-2">{error}</p>
        </div>
      )}

      {/* Loading State (Skeletons) */}
      {isLoading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <div className="w-full aspect-square bg-[var(--mama-pink)]/30 animate-pulse rounded-xl" />
              <div className="w-3/4 h-5 bg-gray-200 animate-pulse rounded" />
              <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-pink-50">
          <PackageX className="w-16 h-16 text-[var(--color-light-gray)] mb-4" />
          <h2 className="text-xl font-bold text-[var(--mama-brown)] mb-2 text-font-1">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-[var(--color-gray)] text-font-2 max-w-md">
            Maaf, kami tidak dapat menemukan produk yang cocok dengan pencarian
            &quot;{query}&quot;. Coba gunakan kata kunci lain.
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5 md:gap-6">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      )}
    </div>
  );
}
