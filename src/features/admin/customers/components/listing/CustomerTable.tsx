"use client";

import React from "react";
import { PackageX } from "lucide-react";
import { Customer } from "@/features/admin/customers/types/customer.types";

interface CustomerTableProps {
  customers: Customer[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(dateString));
  };

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-100">
        <PackageX className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-font-4 text-[var(--mama-brown)] font-semibold mb-2">
          Tidak Ada Pelanggan Ditemukan
        </h3>
        <p className="text-font-2 text-gray-500">
          Coba ubah kata kunci pencarian atau filter status.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white">
      <table className="w-full min-w-[900px] text-left border-collapse">
        <thead className="bg-[var(--mama-pink)] border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-font-2 md:text-font-2 font-semibold text-[var(--mama-brown)]">
              Pelanggan
            </th>
            <th className="px-6 py-4 text-font-2 md:text-font-2 font-semibold text-[var(--mama-brown)]">
              No. Telepon
            </th>
            <th className="px-6 py-4 text-font-2 md:text-font-2 font-semibold text-[var(--mama-brown)]">
              Pesanan
            </th>
            <th className="px-6 py-4 text-font-2 md:text-font-2 font-semibold text-[var(--mama-brown)]">
              Total Belanja
            </th>
            <th className="px-6 py-4 text-font-2 md:text-font-2 font-semibold text-[var(--mama-brown)]">
              Tanggal Bergabung
            </th>
            <th className="px-6 py-4 text-font-2 md:text-font-2 font-semibold text-[var(--mama-brown)]">
              Status
            </th>
            <th className="px-6 py-4 text-font-2 md:text-font-2 font-semibold text-[var(--mama-brown)] text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((customer) => {
            return <tr
              key={customer.id}
              className="hover:bg-gray-55 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#D6557E] text-white font-bold text-font-2">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-font-2 md:text-font-2 font-semibold text-gray-800 line-clamp-1">
                      {customer.name}
                    </span>
                    <span className="text-font-1 md:text-font-2 text-gray-500 line-clamp-1">
                      {customer.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-font-2 md:text-font-2 text-gray-600">
                {customer.phone || "-"}
              </td>
              <td className="px-6 py-4 text-font-2 md:text-font-2 text-gray-600">
                {customer.totalOrders}
              </td>
              <td className="px-6 py-4 text-font-2 md:text-font-2 text-gray-600">
                {formatIDR(customer.totalSpent)}
              </td>
              <td className="px-6 py-4 text-font-2 md:text-font-2 text-gray-600">
                {formatDate(customer.registeredAt)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-font-1 font-medium ${
                    !customer.isBlocked
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {!customer.isBlocked ? "Aktif" : "Diblokir"}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <a
                  href={`/admin/customers/${customer.id}`}
                  className="inline-block px-3 py-1.5 text-font-1 md:text-font-2 font-medium text-[var(--mama-brown)] bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                >
                  Lihat Detail
                </a>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}