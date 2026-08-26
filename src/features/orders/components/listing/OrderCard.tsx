"use client";

import React from "react";
import Image from "next/image";
import {
  getStatusConfig,
  formatDate,
  formatRupiah,
} from "../../utils/orderFormatting";
import { Order } from "@/features/orders/types/order.types";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const config = getStatusConfig(order.status);

  // Calculate total items (sum of quantities or just array length based on UI need)
  const totalItems = order.orderItems?.length || 0;

  // Determine displayed total: if grandTotal isn't present, fallback to subtotal + shipping + tax
  const calculatedTotal =
    order.grandTotalIdr ??
    order.subtotalIdr + order.shippingCostIdr + order.taxIdr;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col mb-4">
      {/* Header */}
      <div className="p-4 flex justify-between items-start border-b border-gray-50">
        <div>
          <h3 className="text-font-3 font-bold text-[var(--mama-brown)]">
            Order : #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
          </h3>
          <p className="text-font-1 text-[var(--color-gray)] mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-font-1 font-bold ${config.badge}`}
          >
            {config.label}
          </span>
          <span className="text-font-2 font-bold text-[var(--mama-brown)]">
            {totalItems} Produk
          </span>
        </div>
      </div>

      {/* Product Images (Horizontal Scroll/List) */}
      <div className="p-4 flex gap-4 overflow-x-auto hide-scrollbar">
        {order.orderItems?.map((item) => {
          // Using a fallback placeholder if image doesn't exist
          const imageUrl =
            item.variant?.images?.[0]?.imageUrl || "/images/placeholder.png";

          return (
            <div
              key={item.id}
              className="relative w-20 h-20 flex-shrink-0 rounded-md border border-gray-100 overflow-hidden"
            >
              <Image
                src={imageUrl}
                alt={item.product?.name || "Product Image"}
                fill
                className="object-contain"
              />
            </div>
          );
        })}
      </div>

      {/* Footer Action */}
      <div className={`p-4 flex justify-between items-center ${config.footer}`}>
        <p className="text-font-3 font-bold">
          Total : {formatRupiah(calculatedTotal)}
        </p>
        <Link
          href={`/account/orders/${order.id}`}
          className="bg-black text-white text-font-1 font-bold px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Lihat Pesanan
        </Link>
      </div>
    </div>
  );
}
