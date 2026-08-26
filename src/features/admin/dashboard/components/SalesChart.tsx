"use client";

import { useState, useEffect, useRef } from "react";
import { SalesReportData } from "../types/dashboard";
import { ChartPeriod } from "../hooks/useDashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface SalesChartProps {
  salesData: SalesReportData;
  currentPeriod: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  isLoading: boolean;
}

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

/**
 * Formats the raw period string from the backend based on the selected ChartPeriod.
 */
const formatDisplayDate = (
  rawPeriod: string,
  periodType: ChartPeriod,
): string => {
  try {
    if (periodType === "daily") {
      const date = new Date(`${rawPeriod}T00:00:00`);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    if (periodType === "weekly") {
      const parts = rawPeriod.split("-W");
      if (parts.length === 2) {
        return `Mg ${parts[1]} ${parts[0]}`;
      }
      return rawPeriod;
    }

    if (periodType === "monthly") {
      const date = new Date(`${rawPeriod}-01`);
      return date.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      });
    }

    return rawPeriod;
  } catch {
    return rawPeriod;
  }
};

/**
 * Fills in missing dates with 0 values for daily charts to create a continuous timeline.
 */
const fillMissingDays = (
  trends: SalesReportData["trends"],
): SalesReportData["trends"] => {
  if (!trends || trends.length === 0) return [];

  // Sort chronologically
  const sortedTrends = [...trends].sort((a, b) =>
    a.period.localeCompare(b.period),
  );

  const startDateStr = sortedTrends[0].period;
  const endDateStr = sortedTrends[sortedTrends.length - 1].period;

  // Append time to prevent local timezone shift bugs
  const startDate = new Date(`${startDateStr}T00:00:00`);
  const endDate = new Date(`${endDateStr}T00:00:00`);

  const filledTrends: SalesReportData["trends"] = [];
  const trendMap = new Map(sortedTrends.map((t) => [t.period, t]));

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (trendMap.has(dateString)) {
      filledTrends.push(trendMap.get(dateString)!);
    } else {
      filledTrends.push({
        period: dateString,
        revenue: 0,
        orders: 0,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledTrends;
};

// ----------------------------------------------------------------------
// Custom Tooltip Component
// ----------------------------------------------------------------------

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      revenue: number;
      orders: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
        <p className="mb-3 text-font-2 font-bold text-[var(--mama-brown)] border-b border-gray-100 pb-2">
          {label}
        </p>
        <div className="flex flex-col gap-2 text-font-2">
          <div className="flex justify-between items-center gap-6">
            <span className="text-[var(--color-gray)]">Pendapatan:</span>
            <span className="font-bold text-[var(--mama-hot-pink)]">
              Rp {data.revenue.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-[var(--color-gray)]">Pesanan:</span>
            <span className="font-bold text-[var(--mama-brown)]">
              {data.orders}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function SalesChart({
  salesData,
  currentPeriod,
  onPeriodChange,
  isLoading,
}: SalesChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

  // Dynamically observe container size to prevent ResponsiveContainer size calculation bugs
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({
        width: width || 0,
        height: height || 300,
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const periods: { label: string; value: ChartPeriod }[] = [
    { label: "Harian", value: "daily" },
    { label: "Mingguan", value: "weekly" },
    { label: "Bulanan", value: "monthly" },
  ];

  // Prepare and process data
  let processedTrends = [...salesData.trends];

  if (currentPeriod === "daily") {
    processedTrends = fillMissingDays(processedTrends);
  } else {
    // For weekly/monthly, just ensure they are sorted chronologically
    processedTrends.sort((a, b) => a.period.localeCompare(b.period));
  }

  const chartData = processedTrends.map((trend) => ({
    ...trend,
    displayDate: formatDisplayDate(trend.period, currentPeriod),
  }));

  // Custom formatter for Y-Axis
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-font-3 font-bold text-[var(--mama-brown)] md:text-font-4">
            Analisis Penjualan
          </h2>
          <p className="text-font-2 text-[var(--color-gray)]">
            Lacak performa penjualan toko Anda
          </p>
        </div>

        <div className="flex space-x-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => onPeriodChange(period.value)}
              className={`rounded-lg px-4 py-2 text-font-2 font-medium transition-colors ${
                currentPeriod === period.value
                  ? "bg-[var(--mama-hot-pink)] text-white"
                  : "bg-[var(--mama-pink)] text-[var(--mama-brown)] hover:bg-opacity-80"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="mt-8 h-[300px] w-full relative min-w-0"
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--mama-pink)] border-t-[var(--mama-hot-pink)]"></div>
          </div>
        )}

        {dimensions.width > 0 ? (
          <AreaChart
            width={dimensions.width}
            height={dimensions.height}
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--mama-hot-pink)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--mama-hot-pink)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={formatRupiah}
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#e5e7eb",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--mama-hot-pink)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{
                r: 6,
                fill: "var(--mama-hot-pink)",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50/50 rounded-lg">
            <span className="text-font-1 text-gray-400">Memuat Grafik...</span>
          </div>
        )}
      </div>
    </div>
  );
}
