"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/features/cart/store/use-cart-store";

// interface MiniCartDropdownProps {
//   isLoggedIn: boolean;
// }

const formatIDR = (amount: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

export const MiniCartDropdown = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <div className="relative w-80 animate-in fade-in zoom-in-95 duration-200 z-[100]">
      {/* Main Card Content */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-stone-100 flex flex-col max-h-[28rem] z-10 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50">
          <h4 className="font-bold text-[var(--mama-brown)] text-sm">
            Keranjang Belanja (
            {items.reduce((acc, item) => acc + item.quantity, 0)})
          </h4>
        </div>

        {/* Cart Items List */}
        <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <ShoppingBag className="w-12 h-12 text-stone-200 mb-3" />
              <p className="text-sm font-semibold text-stone-600 mb-1">
                Keranjangmu masih kosong
              </p>
              <p className="text-xs text-stone-400">
                Ayo temukan produk favoritmu sekarang!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors group"
                  >
                    {/* Item Image Fallback (since image might not be deeply nested in lightweight cart item) */}
                    <div className="relative w-14 h-14 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                      <Image
                        src={
                          item.variant?.images?.[0]?.imageUrl ||
                          item.product?.images?.[0]?.imageUrl ||
                          "/images/placeholder.jpg"
                        }
                        alt={item.product?.name || "Product Image"}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-xs font-semibold text-stone-700 truncate">
                        {item.product?.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-[var(--mama-hot-pink)]">
                          {formatIDR(item.price)}
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Quick Remove Button */}
                    <div className="flex items-center justify-center px-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Hapus produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer / Subtotal */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-stone-500">
                Subtotal
              </span>
              <span className="text-sm font-bold text-[var(--mama-brown)]">
                {formatIDR(subtotal)}
              </span>
            </div>
            <Link
              href="/cart"
              className="flex justify-center items-center w-full bg-[var(--mama-hot-pink)] text-white py-2.5 rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              Lihat Keranjang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};