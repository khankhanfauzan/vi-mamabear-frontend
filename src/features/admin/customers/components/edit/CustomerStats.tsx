"use client";

import React from "react";
import { CustomerDetail } from "@/features/admin/customers/types/customer.types";

interface CustomerStatsProps {
  customer: CustomerDetail;
}

export function CustomerStats({ customer }: CustomerStatsProps) {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    { label: "Total Pesanan", value: customer.totalOrders.toString() },
    { label: "Total Belanja", value: formatIDR(customer.totalSpent) },
    {
      label: "Rata-rata Pesanan",
      value: formatIDR(customer.averageOrderValue),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statCards.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-2"
        >
          <span className="text-font-1 md:text-font-2 text-gray-500">
            {stat.label}
          </span>
          <span className="text-font-3 md:text-font-4 font-semibold text-[var(--mama-brown)]">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
