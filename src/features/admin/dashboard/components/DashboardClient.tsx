"use client";

import { DashboardData, SalesReportData } from "../types/dashboard";
import { useDashboard } from "../hooks/useDashboard";
import { StatCards } from "./StatCards";
import { SalesChart } from "./SalesChart";
import { LowStockList } from "./LowStockList";
import { TopSellingChart } from "./TopSellingChart";
import { RecentOrdersTable } from "./RecentOrdersTable";

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface DashboardClientProps {
  initialDashboardData: DashboardData;
  initialSalesData: SalesReportData;
  accessToken?: string;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function DashboardClient({
  initialDashboardData,
  initialSalesData,
  accessToken,
}: DashboardClientProps) {
  // Initialize hook with server-fetched sales data and optional token for client fetching
  const { salesData, chartPeriod, handlePeriodChange, isLoadingChart } =
    useDashboard(initialSalesData, accessToken);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Section */}
      <div>
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)] md:text-font-6">
          Dashboard
        </h1>
        <p className="text-font-2 text-[var(--color-gray)] md:text-font-3">
          Selamat datang kembali! Berikut ringkasan toko Anda
        </p>
      </div>

      {/* Grid 1: Stat Cards */}
      <StatCards data={initialDashboardData} />

      {/* Grid 2: Sales Chart */}
      <SalesChart
        salesData={salesData}
        currentPeriod={chartPeriod}
        onPeriodChange={handlePeriodChange}
        isLoading={isLoadingChart}
      />

      {/* Grid 3: Two Columns for Low Stock & Top Selling */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LowStockList products={initialDashboardData.getLowStockProducts} />
        <TopSellingChart products={initialDashboardData.getTopSellingProducts} />
      </div>

      {/* Grid 4: Recent Orders */}
      <RecentOrdersTable orders={initialDashboardData.getRecentOrder} />
    </div>
  );
}