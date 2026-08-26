"use client";

import React from "react";
import { CustomerOrderHistory as OrderHistoryType } from "@/features/admin/customers/types/customer.types";
import { PackageX } from "lucide-react";

interface CustomerOrderHistoryProps {
  orders: OrderHistoryType[];
}

export function CustomerOrderHistory({ orders }: CustomerOrderHistoryProps) {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAYMENT_PENDING":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-font-1 font-medium bg-yellow-100 text-yellow-800">
            Menunggu Pembayaran
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-font-1 font-medium bg-green-100 text-green-800">
            Selesai
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-font-1 font-medium bg-red-100 text-red-800">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-font-1 font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-font-4 font-bold text-[var(--mama-brown)]">
          Riwayat Pesanan
        </h2>
        <p className="text-font-2 text-gray-500 mt-1">
          Daftar lengkap pesanan pelanggan
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 flex-grow">
          <PackageX className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-font-2 text-gray-500">
            Belum ada riwayat pesanan.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead className="bg-[var(--mama-pink)] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-font-2 font-semibold text-[var(--mama-brown)]">
                  ID Pesanan
                </th>
                <th className="px-6 py-4 text-font-2 font-semibold text-[var(--mama-brown)]">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-font-2 font-semibold text-[var(--mama-brown)]">
                  Status
                </th>
                <th className="px-6 py-4 text-font-2 font-semibold text-[var(--mama-brown)]">
                  Total
                </th>
                <th className="px-6 py-4 text-font-2 font-semibold text-[var(--mama-brown)] text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-55 transition-colors"
                >
                  <td className="px-6 py-4 text-font-2 font-medium text-gray-900">
                    {`#${order.id.split("-")[0]}`}
                  </td>
                  <td className="px-6 py-4 text-font-2 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-font-2 font-medium text-gray-900">
                    {formatIDR(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-3 py-1.5 text-font-1 md:text-font-2 font-medium text-[var(--mama-brown)] bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
