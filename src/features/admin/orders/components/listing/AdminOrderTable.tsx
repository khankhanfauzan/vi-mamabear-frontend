"use client";

import React from "react";
import Link from "next/link";
import {
  OrderDetail,
  OrderStatus,
} from "@/features/admin/orders/types/adminOrder.types";
import {
  ORDER_STATUS_OPTIONS,
  FAILED_STATUSES,
} from "@/features/admin/orders/utils/orderStatus";

interface AdminOrderTableProps {
  orders: OrderDetail[]; // Updated to accept OrderDetail
  isLoading: boolean;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
};

const getPaymentBadge = (status: OrderStatus) => {
  if (status === "PAYMENT_PENDING") {
    return (
      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
        Pending
      </span>
    );
  }
  if (FAILED_STATUSES.includes(status)) {
    return (
      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
        Failed/Refund
      </span>
    );
  }
  if (["RECEIVED", "COMPLETED"].includes(status as string)) {
    return (
      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
        Done
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
      In Progress
    </span>
  );
};

export function AdminOrderTable({
  orders,
  isLoading,
  onUpdateStatus,
}: AdminOrderTableProps) {
  // Skeletons and Empty states omitted for brevity (keep them as they were)
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-12 bg-[var(--mama-pink)] opacity-50 w-full border-b" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 w-full border-b flex items-center px-6 gap-4"
          >
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <p className="text-[var(--mama-brown)] text-font-4 font-bold mb-2">
          Tidak ada pesanan ditemukan
        </p>
        <p className="text-[var(--color-gray)] text-font-2">
          Coba ubah filter atau kata kunci pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow border border-gray-100 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-[var(--mama-pink)] text-[var(--mama-brown)] text-font-1 md:text-font-2 font-bold border-b border-gray-200">
            <th className="p-4">ID Pesanan</th>
            <th className="p-4">Pelanggan</th>
            <th className="p-4">Tanggal</th>
            <th className="p-4">Item</th>
            <th className="p-4">Total</th>
            <th className="p-4">Pembayaran</th>
            <th className="p-4">Status</th>
            <th className="p-4">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-font-2 text-[var(--color-gray)]">
          {orders.map((order) => {
            const total =
              order.subtotalIdr + order.taxIdr + order.shippingCostIdr;
            // Calculate total items properly since we now have the nested orderItems array
            const totalItems =
              order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) ||
              0;

            return (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-bold text-[var(--mama-brown)]">
                  #{order.id.slice(0, 5).toUpperCase()}
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-[var(--mama-brown)]">
                      {order.user?.name || "Customer"}
                    </span>
                    <span className="text-xs text-[var(--color-light-gray)]">
                      {order.user?.email}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm">{formatDate(order.createdAt)}</td>
                <td className="p-4 text-center font-medium">{totalItems}</td>
                <td className="p-4 font-medium">{formatCurrency(total)}</td>
                <td className="p-4">{getPaymentBadge(order.status)}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      onUpdateStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--mama-hot-pink)] bg-white cursor-pointer"
                  >
                    {ORDER_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-block px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
