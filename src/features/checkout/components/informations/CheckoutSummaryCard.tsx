import React from "react";
import Image from "next/image";
import { Cart } from "@/features/cart/types/cart.types";
import {ShippingOption} from "@/features/address/types/shipping.types";

interface CheckoutSummaryCardProps {
  cart: Cart | null;
  isLoadingCart: boolean;
  isCalculatingShipping: boolean;
  isSubmitting: boolean;
  selectedShipping: ShippingOption;
  totals: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    promoDiscount: number;
    grandTotal: number;
  };
  onCheckout: () => void;
  formatRupiah: (amount: number) => string;
}

export function CheckoutSummaryCard({
  cart,
  isLoadingCart,
  isCalculatingShipping,
  isSubmitting,
  selectedShipping,
  totals,
  onCheckout,
  formatRupiah,
}: CheckoutSummaryCardProps) {
  return (
    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Cart Items List */}
        <div className="p-5 space-y-5 border-b border-gray-200">
          {isLoadingCart
            ? Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="flex gap-4 items-start animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mt-2 self-end ml-auto"></div>
                  </div>
                </div>
              ))
            : cart?.items?.map((item) => {
                const itemImage =
                  item.variant?.images?.[0]?.imageUrl ||
                  item.product?.images?.[0]?.imageUrl ||
                  "/images/placeholder.png";

                return (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-pink-50 rounded-md shrink-0 flex items-center justify-center border border-pink-100 overflow-hidden relative">
                      <Image
                        src={itemImage}
                        alt={item.product?.name || "Product image"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <h4 className="text-font-1 font-bold text-black leading-snug line-clamp-2">
                          {item.product?.name}
                        </h4>
                        <span className="text-font-1 font-bold text-black whitespace-nowrap">
                          Qty {item.quantity}
                        </span>
                      </div>
                      <p className="text-font-1 text-gray-500 mt-1 font-medium">
                        {item.variant?.name}
                      </p>
                      <p className="text-font-2 font-bold text-red-600 mt-2 text-right">
                        {formatRupiah(parseFloat(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Calculations */}
        <div className="p-5 space-y-3 bg-white">
          <div className="flex justify-between text-font-2">
            <span className="text-gray-600">Subtotal</span>
            {isLoadingCart ? (
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            ) : (
              <span className="font-bold text-black">
                {formatRupiah(totals.subtotal)}
              </span>
            )}
          </div>
          <div className="flex justify-between text-font-2">
            <span className="text-gray-600">Ongkos Kirim</span>
            {isCalculatingShipping ? (
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            ) : (
              <span className="font-bold text-black">
                {totals.shippingCost > 0
                  ? formatRupiah(totals.shippingCost)
                  : "-"}
              </span>
            )}
          </div>

          {/* Pajak (Tax) */}
          <div className="flex justify-between text-font-2">
            <span className="text-gray-600">Pajak</span>
            {isLoadingCart ? (
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            ) : (
              <span className="font-bold text-black">
                {totals.tax > 0 ? formatRupiah(totals.tax) : "-"}
              </span>
            )}
          </div>

          {totals.promoDiscount > 0 && (
            <div className="flex justify-between text-font-2">
              <span className="text-gray-600">Promo</span>
              <span className="font-bold text-red-600">
                ({formatRupiah(totals.promoDiscount)})
              </span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="bg-[var(--mama-hot-pink)] p-5 flex justify-between items-center text-white">
          <span className="text-font-2 font-bold uppercase">Total</span>
          {isLoadingCart || isCalculatingShipping ? (
            <div className="h-6 bg-pink-400 rounded w-24 animate-pulse"></div>
          ) : (
            <span className="text-font-4 font-bold">
              {formatRupiah(totals.grandTotal)}
            </span>
          )}
        </div>
      </div>

      {/* Action Button (Desktop visible) */}
      <div className="hidden lg:block mt-6">
        <button
          onClick={onCheckout}
          disabled={isLoadingCart || isSubmitting || !selectedShipping}
          className="w-full bg-[var(--mama-hot-pink)] hover:bg-[#c24467] text-white font-bold py-4 px-4 rounded-full transition-colors text-font-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
        >
          {isSubmitting ? "Memproses..." : "Lanjut ke Pembayaran"}
        </button>
      </div>
    </div>
  );
}
