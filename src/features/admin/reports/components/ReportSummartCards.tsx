"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { SalesReportData } from "@/features/admin/reports/types/report.types";

interface DashboardSummaryCardsProps {
  salesData: SalesReportData;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export function DashboardSummaryCards({
  salesData,
}: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500 font-medium">
            Total Pendapatan
          </span>
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <h3 className="text-3xl font-bold text-[var(--mama-brown)] mb-2">
          {formatCurrency(salesData.totalRevenue)}
        </h3>
        <p className="text-xs text-emerald-500">Kalkulasi periode saat ini</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500 font-medium">
            Total Pesanan
          </span>
        </div>
        <h3 className="text-3xl font-bold text-[var(--mama-brown)] mb-2">
          {salesData.orderCount}
        </h3>
        <p className="text-xs text-emerald-500">Kalkulasi periode saat ini</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500 font-medium">
            Rata-rata Nilai Pesanan
          </span>
        </div>
        <h3 className="text-3xl font-bold text-[var(--mama-brown)] mb-2">
          {formatCurrency(salesData.avgOrderValue)}
        </h3>
        <p className="text-xs text-emerald-500">Kalkulasi periode saat ini</p>
      </div>
    </div>
  );
}
