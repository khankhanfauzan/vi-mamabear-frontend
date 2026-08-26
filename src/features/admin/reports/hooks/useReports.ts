import { useState, useEffect } from "react";
import {
  getSalesReport,
  getDashboardReport,
  exportSalesReportCsv,
  getProductPerformanceReport,
} from "@/features/admin/reports/services/reportService";
import {
  SalesReportData,
  DashboardReportData,
  SalesReportQuery,
  ProductPerformanceData,
} from "@/features/admin/reports/types/report.types";
import { Category } from "@/features/categories/types/category.types";
import { fetchCategories } from "@/features/categories/services/categoryService";

export function useReports(
  initialPeriod: "daily" | "weekly" | "monthly" = "monthly",
) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    initialPeriod,
  );
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);

  const [salesData, setSalesData] = useState<SalesReportData | null>(null);
  const [dashboardData, setDashboardData] =
    useState<DashboardReportData | null>(null);
  const [productData, setProductData] = useState<
    ProductPerformanceData[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Fetch real categories once on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true);
      setError(null);
      try {
        const query: SalesReportQuery = { period, categoryId };

        // Fetch all three reports in parallel, including the products endpoint
        // which contains the actual category mappings!
        const [sales, dashboard, products] = await Promise.all([
          getSalesReport(query),
          getDashboardReport(query),
          getProductPerformanceReport(query),
        ]);

        setSalesData(sales);
        setDashboardData(dashboard);
        setProductData(products);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat laporan",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [period, categoryId]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportSalesReportCsv({ period });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-penjualan-${period}-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      // In a real app, trigger a toast notification here
      alert("Gagal mengunduh laporan. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    period,
    setPeriod,
    categoryId,
    setCategoryId,
    categories,
    salesData,
    dashboardData,
    productData,
    isLoading,
    error,
    handleExport,
    isExporting
  };
}
