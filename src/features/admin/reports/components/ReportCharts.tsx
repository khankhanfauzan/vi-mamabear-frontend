"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  SalesTrend,
  ProductPerformanceData,
} from "@/features/admin/reports/types/report.types";

// Utility to format currency in charts
const formatIDR = (value: number) => {
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}K`;
  return `Rp ${value}`;
};

// Smart period parser to handle "YYYY-MM-DD", "YYYY-Www" (like 2026-W25), and "YYYY-MM"
const formatPeriodLabel = (val: string): string => {
  if (!val) return "";

  // Handle ISO Week Format: "2026-W25"
  if (val.includes("-W")) {
    const [year, week] = val.split("-W");
    return `Mgg ${week}, ${year}`;
  }

  // Handle Month Format: "2026-06"
  const parts = val.split("-");
  if (parts.length === 2) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const monthName = monthNames[monthIndex] || parts[1];
    return `${monthName} ${year}`;
  }

  // Handle Standard Date Format: "2026-06-12"
  const date = new Date(val);
  if (isNaN(date.getTime())) {
    return val; // Fallback to raw string if parsing fails
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Custom Colors matching MamaBear Branding
const COLORS = ["#d6557e", "#6c4735", "#fbcbd9", "#a07c6a", "#e88ba6"];

export const RevenueLineChart = ({ data }: { data: SalesTrend[] }) => {
  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-gray)", fontSize: 12 }}
            dy={10}
            tickFormatter={formatPeriodLabel}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-gray)", fontSize: 12 }}
            tickFormatter={formatIDR}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-gray)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #fbcbd9" }}
            labelFormatter={(label: unknown) =>
              formatPeriodLabel(String(label || ""))
            }
            formatter={(value: unknown, name: unknown) => {
              const nameStr = String(name || "");
              const valueNum = Number(value || 0);
              return [
                nameStr === "Pendapatan (Rp)"
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(valueNum)
                  : String(valueNum),
                nameStr,
              ];
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            name="Pendapatan (Rp)"
            stroke="var(--mama-hot-pink)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--mama-hot-pink)" }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name="Pesanan"
            stroke="var(--mama-brown)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--mama-brown)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryBarChart = ({
  data,
}: {
  data: ProductPerformanceData[];
}) => {
  // Directly grouping by the real 'category' field returned from the API
  const aggregatedData = data
    .reduce(
      (acc, item) => {
        const existing = acc.find((x) => x.name === item.category);

        if (existing) {
          existing.terjual += item.salesCount;
        } else {
          acc.push({
            name: item.category || "Lainnya",
            terjual: item.salesCount,
          });
        }

        return acc;
      },
      [] as { name: string; terjual: number }[],
    )
    .sort((a, b) => b.terjual - a.terjual); // Sort by highest sales

  return (
    <div className="mt-4 w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={aggregatedData}
          margin={{ top: 5, right: 0, bottom: 5, left: -20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-gray)", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-gray)", fontSize: 12 }}
          />
          <Tooltip cursor={{ fill: "var(--mama-pink)", opacity: 0.2 }} />
          <Bar
            dataKey="terjual"
            name="Total Terjual"
            fill="var(--mama-hot-pink)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryPieChart = ({
  data,
}: {
  data: ProductPerformanceData[];
}) => {
  // Directly grouping by the real 'category' field returned from the API
  const aggregatedData = data
    .reduce(
      (acc, item) => {
        // If no sales exist, default to 1 so the pie chart still renders a slice visually
        const val = item.salesCount > 0 ? item.salesCount : 1;
        const existing = acc.find((x) => x.name === item.category);

        if (existing) {
          existing.value += val;
        } else {
          acc.push({ name: item.category || "Lainnya", value: val });
        }

        return acc;
      },
      [] as { name: string; value: number }[],
    )
    .sort((a, b) => b.value - a.value);

  return (
    <div className="mt-4 w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={aggregatedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={(props: { name?: string | number; percent?: number }) => {
              const labelName = String(props.name || "");
              const labelPercent = Number(props.percent || 0);
              return `${labelName} ${(labelPercent * 100).toFixed(0)}%`;
            }}
            labelLine={false}
          >
            {aggregatedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
