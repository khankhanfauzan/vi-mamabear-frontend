"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useReports } from "../hooks/useReports";
import {
  RevenueLineChart,
  CategoryBarChart,
  CategoryPieChart,
} from "./ReportCharts";
import { DashboardHeader } from "@/features/admin/reports/components/ReportHeader";
import { DashboardSummaryCards } from "@/features/admin/reports/components/ReportSummartCards";

export function ReportDashboard() {
  const {
    period,
    setPeriod,
    categoryId,
    setCategoryId,
    categories,
    salesData,
    dashboardData,
    productData, // Get productData from hook
    error,
    handleExport,
    isExporting,
  } = useReports("monthly");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (error || !salesData || !dashboardData || !productData) {
    // Check productData
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (error || !salesData || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[var(--mama-cream)] rounded-xl border border-[var(--mama-pink)] text-[var(--mama-brown)]">
        <AlertCircle className="w-12 h-12 mb-4 text-[var(--mama-hot-pink)]" />
        <h3 className="text-font-4 font-bold mb-2">Gagal Memuat Laporan</h3>
        <p className="text-font-2 text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        period={period}
        setPeriod={setPeriod}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
        handleExport={handleExport}
        isExporting={isExporting}
      />

      <DashboardSummaryCards salesData={salesData} />

      {/* Revenue Line Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-[var(--mama-brown)]">
          Tren Pendapatan
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Tren pendapatan dan pesanan berkala
        </p>
        <RevenueLineChart data={salesData.trends} />
      </div>

      {/* Category Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--mama-brown)]">
            Penjualan per Kategori
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Kategori produk dengan performa terbaik
          </p>
          {/* Pass the explicitly mapped productData */}
          <CategoryBarChart data={productData} />
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--mama-brown)]">
            Distribusi Kategori
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Pangsa pendapatan berdasarkan kategori
          </p>
          {/* Pass the explicitly mapped productData */}
          <CategoryPieChart data={productData} />
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[var(--mama-brown)]">
            Produk Teratas Berdasarkan Pendapatan
          </h3>
          <p className="text-sm text-gray-500">
            Produk dengan performa terbaik pada periode terpilih
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--mama-pink)] bg-opacity-20 text-[var(--mama-brown)] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Peringkat</th>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold text-center">Terjual</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Pendapatan
                </th>
              </tr>
            </thead>
            <tbody>
              {salesData.topProducts.map((product, index) => (
                <tr
                  key={product.productId}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-500">#{index + 1}</td>
                  <td
                    className="px-6 py-4 font-medium text-[var(--mama-brown)] max-w-md truncate"
                    title={product.productName}
                  >
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.quantitySold}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
              {salesData.topProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Belum ada data penjualan produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
