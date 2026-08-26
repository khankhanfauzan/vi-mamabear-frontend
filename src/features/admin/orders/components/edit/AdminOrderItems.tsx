"use client";

import React from "react";
import { OrderDetail } from "@/features/admin/orders/types/adminOrder.types";

interface AdminOrderItemsProps {
  order: OrderDetail;
}

const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

export function AdminOrderItems({ order }: AdminOrderItemsProps) {
  const total = order.subtotalIdr + order.taxIdr + order.shippingCostIdr;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-6">
        Daftar Item
      </h2>

      <div className="flex flex-col gap-6">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
              {item.product.images?.[0]?.imageUrl ? (
                <img
                  src={item.product.images[0].imageUrl}
                  alt={item.product.images[0].altText || item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  No Img
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-font-2 font-medium text-[var(--color-gray)] truncate">
                {item.product.name}
              </h3>
              <p className="text-sm text-[var(--color-light-gray)]">
                Varian: {item.variant.name} &bull; Kuantitas: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="text-font-2 font-medium text-[var(--color-gray)]">
                {formatCurrency(Number(item.price) * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex justify-between text-font-2 text-[var(--color-gray)]">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotalIdr)}</span>
        </div>
        <div className="flex justify-between text-font-2 text-[var(--color-gray)]">
          <span>Pajak (Tax)</span>
          <span>{formatCurrency(order.taxIdr)}</span>
        </div>
        <div className="flex justify-between text-font-2 text-[var(--color-gray)]">
          <span>Ongkos Kirim</span>
          <span>{formatCurrency(order.shippingCostIdr)}</span>
        </div>
        <div className="flex justify-between text-font-3 font-bold text-[var(--mama-brown)] pt-3 border-t border-gray-100 mt-2">
          <span>Total Keseluruhan</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
