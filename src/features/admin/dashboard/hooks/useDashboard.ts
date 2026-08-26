import { useState } from "react";
import { SalesReportData } from "../types/dashboard";
import { fetchSalesReportData } from "../services/dashboardService";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type ChartPeriod = "daily" | "weekly" | "monthly";

// ----------------------------------------------------------------------
// Hook Implementation
// ----------------------------------------------------------------------

export function useDashboard(initialSalesData: SalesReportData, accessToken?: string) {
  // Store the sales data
  const [salesData, setSalesData] = useState<SalesReportData>(initialSalesData);
  
  // Track selected chart period
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  
  // Track loading state if we fetch data on period change
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  /**
   * Handles changing the chart period.
   * Calls fetchSalesReportData with the selected period parameter.
   */
  const handlePeriodChange = async (period: ChartPeriod) => {
    setChartPeriod(period);
    setIsLoadingChart(true);
    
    try {
      // Call the service with the params object we just updated
      const newData = await fetchSalesReportData(accessToken, { period });
      setSalesData(newData);
    } catch (error) {
      console.error("[useDashboard] Error changing period:", error);
    } finally {
      setIsLoadingChart(false);
    }
  };

  return {
    salesData,
    chartPeriod,
    handlePeriodChange,
    isLoadingChart,
  };
}
