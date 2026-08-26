"use client";

import React from "react";
import Image from "next/image";
import { Order } from "@/features/orders/types/order.types";
import { formatRupiah } from "@/features/orders/utils/orderFormatting";

interface OrderDetailSummaryProps {
  order: Order;
}

/**
 * Renders the list of purchased items and the total pricing breakdown.
 */
export default function OrderDetailSummary({ order }: OrderDetailSummaryProps) {
  // Calculate potential promo/discount safely by casting strings to Numbers
  const totalBeforeDiscount =
    Number(order.subtotalIdr || 0) +
    Number(order.shippingCostIdr || 0) +
    Number(order.taxIdr || 0);
  const grandTotal =
    order.grandTotalIdr != null ? Number(order.grandTotalIdr) : totalBeforeDiscount;
  const promoAmount =
    totalBeforeDiscount > grandTotal ? totalBeforeDiscount - grandTotal : 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-6">
      {/* Product Items List */}
      <div className="flex flex-col">
        {order.orderItems.map((item, index) => {
          const imageUrl =
            item.variant?.images?.[0]?.imageUrl || "/images/placeholder.png";
          const productName =
            item.product?.name || item.productName || "Produk MamaBear";
          const variantName =
            item.variant?.name || item.variantName || "Varian Standard";

          // Safely parse the price to a number, falling back to variant price or 0
          const price = Number(item.price || item.variant?.priceIdr || 0);

          return (
            <div
              // Menggunakan kombinasi id dan index untuk memastikan key selalu unik
              key={`${item.id || "item"}-${index}`}
              className={`p-5 flex gap-4 ${index !== order.orderItems.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md border border-gray-100 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={productName}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col">
                  <h4 className="text-font-2 font-bold text-[var(--mama-brown)] line-clamp-2">
                    {productName}
                  </h4>
                  <p className="text-font-1 text-[var(--color-gray)] mt-1">
                    {variantName}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end flex-shrink-0 gap-1">
                  <span className="text-font-2 font-bold text-[var(--mama-brown)]">
                    Qty {item.quantity}
                  </span>
                  <span className="text-font-2 font-bold text-red-600">
                    {formatRupiah(price)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Breakdown */}
      <div className="p-5 bg-white flex flex-col gap-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-font-2 text-[var(--color-gray)]">
          <span>Subtotal</span>
          <span className="font-bold text-[var(--mama-brown)]">
            {formatRupiah(Number(order.subtotalIdr || 0))}
          </span>
        </div>

        <div className="w-full h-px bg-gray-200" />

        <div className="flex justify-between items-center text-font-2 text-[var(--color-gray)]">
          <span>Ongkos Kirim</span>
          <span className="font-bold text-[var(--mama-brown)]">
            {formatRupiah(Number(order.shippingCostIdr || 0))}
          </span>
        </div>

        {/* Render Tax if applicable and greater than 0 */}
        {Number(order.taxIdr || 0) > 0 && (
          <>
            <div className="w-full h-px bg-gray-200" />
            <div className="flex justify-between items-center text-font-2 text-[var(--color-gray)]">
              <span>Pajak (Tax)</span>
              <span className="font-bold text-[var(--mama-brown)]">
                {formatRupiah(Number(order.taxIdr || 0))}
              </span>
            </div>
          </>
        )}

        {/* Render Promo if discount exists */}
        {promoAmount > 0 && (
          <>
            <div className="w-full h-px bg-gray-200" />
            <div className="flex justify-between items-center text-font-2">
              <span className="text-[var(--color-gray)]">Promo</span>
              <span className="font-bold text-red-600">
                ({formatRupiah(promoAmount)})
              </span>
            </div>
          </>
        )}
      </div>

      {/* Grand Total Footer */}
      <div className="p-5 bg-[var(--mama-hot-pink)] text-white flex justify-between items-center">
        <span className="text-font-3 font-bold uppercase tracking-wider">
          Total
        </span>
        <span className="text-font-4 font-bold">
          {formatRupiah(grandTotal)}
        </span>
      </div>
    </div>
  );
}
