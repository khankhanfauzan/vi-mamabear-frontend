"use client";

import React from "react";
import { useOrderList } from "../../hooks/useOrderList";
import OrderTabs from "./OrderTabs";
import OrderCard from "./OrderCard";
import { PackageX } from "lucide-react";

export default function OrderList() {
  const { orders, isLoading, isLoadingMore, error, hasMore, handleLoadMore } =
    useOrderList();

  return (
    <div className="w-full flex flex-col min-h-[60vh]">
      <OrderTabs />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !error && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 w-full bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageX className="w-16 h-16 text-[var(--color-light-gray)] mb-4" />
          <h2 className="text-font-4 font-bold text-[var(--mama-brown)] mb-2">
            Belum Ada Pesanan
          </h2>
          <p className="text-font-2 text-[var(--color-gray)] max-w-md">
            Anda belum memiliki pesanan dalam kategori ini. Mari jelajahi produk
            menarik dari MamaBear!
          </p>
        </div>
      )}

      {/* Order Cards Grid/List */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination / Load More */}
      {hasMore && orders.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-[var(--mama-pink)] text-[var(--mama-brown)] font-bold rounded-full disabled:opacity-50 transition-opacity hover:opacity-80"
          >
            {isLoadingMore ? "Memuat..." : "Muat Lebih Banyak"}
          </button>
        </div>
      )}
    </div>
  );
}
