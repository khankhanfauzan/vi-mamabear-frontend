"use client";

import React from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCartLogic } from "../hooks/useCart";
import { FreeShippingBar } from "./FreeShippingBar";
import { CartItemCard } from "./CartItemCard";
import { OrderSummary } from "./OrderSummary";

export function CartClientView() {
  const {
    items,
    isLoading,
    selectedIds,
    updateQuantity,
    removeItem,
    handleRemoveSelected,
    handleCheckout,
    subtotal,
    totalQuantity,
    grandTotal,
    discountAmount,
    missingForFreeShipping,
    freeShippingProgress,
    promoCode,
    setPromoCode,
    appliedPromo,
    handleApplyPromo,
    isCheckingOut,
  } = useCartLogic();

  // const isAllSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      <main className="page-max-width px-4 sm:px-6 pt-10">
        <h1 className="text-font-6 font-bold text-[var(--mama-brown)] mb-8">
          Keranjang
        </h1>

        {items.length > 0 && (
          <FreeShippingBar
            missingAmount={missingForFreeShipping}
            progress={freeShippingProgress}
          />
        )}

        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-2">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              <div className="flex justify-between items-center py-4 mb-2">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 py-6 border-b border-gray-100">
                  <div className="flex items-start pt-8">
                     <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-xl animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 flex flex-col py-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse mb-auto"></div>
                    <div className="flex justify-between items-end pt-4 w-full">
                       <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                       <div className="h-9 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
              <div className="h-[22rem] bg-gray-100 rounded-2xl animate-pulse w-full border border-gray-200 shadow-sm"></div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={80} className="text-gray-200 mb-6" />
            <h2 className="text-font-4 font-bold text-[var(--mama-brown)] mb-2">
              Keranjang Mama masih kosong
            </h2>
            <p className="text-font-2 text-[var(--color-gray)] mb-8 max-w-md">
              Yuk, mulai belanja dan temukan berbagai produk ASI booster terbaik
              untuk perjalanan mengasihi Mama!
            </p>
            <a
              href="/products"
              className="bg-[var(--mama-hot-pink)] text-white px-8 py-3 rounded-full font-bold text-font-2 shadow-md hover:opacity-90 transition-all"
            >
              Mulai Belanja
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="flex justify-end items-center py-4 mb-2">
                {/* <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    disabled
                    className="w-5 h-5 accent-[var(--mama-hot-pink)] cursor-not-allowed opacity-60 rounded border-gray-300"
                  />
                  <span className="text-font-2 font-medium text-[var(--color-gray)]">
                    Pilih Semua
                  </span>
                </div> */}
                <div className="flex items-center gap-4">
                  <span className="text-font-2 font-medium text-[var(--mama-brown)]">
                    {totalQuantity} items
                  </span>
                  <button
                    onClick={handleRemoveSelected}
                    disabled={selectedIds.size === 0}
                    className="text-[var(--mama-brown)] hover:text-[var(--mama-hot-pink)] disabled:opacity-50 transition-colors p-1"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQty={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {}
            <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
              <OrderSummary
                subtotal={subtotal}
                discountAmount={discountAmount}
                grandTotal={grandTotal}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                appliedPromo={appliedPromo}
                handleApplyPromo={handleApplyPromo}
                selectedCount={selectedIds.size}
                handleCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}