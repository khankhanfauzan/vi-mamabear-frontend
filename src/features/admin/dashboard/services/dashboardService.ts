import { API_BASE_URL } from "@/lib/config";
import {
  ApiResponse,
  DashboardData,
  SalesReportData,
} from "../types/dashboard";

// ----------------------------------------------------------------------
// Query Parameters Interfaces
// ----------------------------------------------------------------------

export interface SalesReportQueryParams {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  productId?: number;
  status?: string; // Tipe string digunakan sebagai ganti OrderStatus enum untuk fleksibilitas
  period?: "daily" | "weekly" | "monthly";
}

// ----------------------------------------------------------------------
// Services
// ----------------------------------------------------------------------

/**
 * Fetches dashboard statistics and report data for the admin panel.
 * Uses native fetch to allow Next.js server-side caching controls.
 * * @param accessToken - Optional authorization token for server-side fetching
 * @returns Promise containing the DashboardData object
 */
export async function fetchDashboardData(
  accessToken?: string,
): Promise<DashboardData> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${API_BASE_URL}/admin/reports/dashboard`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil data dashboard: HTTP ${res.status}`);
    }

    // Explicitly cast the parsed JSON to our predefined ApiResponse interface
    const response: ApiResponse<DashboardData> = await res.json();

    if (!response.success || !response.data) {
      // Handle the string[] message format as defined in the guidelines
      const errorMessage =
        response.message && response.message.length > 0
          ? response.message[0]
          : "Gagal memuat data dashboard. Silakan coba lagi.";

      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    console.error("[dashboardService] fetchDashboardData failed:", error);
    throw error;
  }
}

/**
 * Fetches sales report data including trends and top products.
 * Uses native fetch to allow Next.js server-side caching controls.
 * @param accessToken - Optional authorization token for server-side fetching
 * @param params - Optional query parameters object corresponding to SalesReportQueryDto
 * @returns Promise containing the SalesReportData object
 */
export async function fetchSalesReportData(
  accessToken?: string,
  params?: SalesReportQueryParams,
): Promise<SalesReportData> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Construct URL with optional query parameters for robust filtering
    const url = new URL(`${API_BASE_URL}/admin/reports/sales`);

    if (params) {
      if (params.startDate)
        url.searchParams.append("startDate", params.startDate);
      if (params.endDate) url.searchParams.append("endDate", params.endDate);
      if (params.categoryId)
        url.searchParams.append("categoryId", params.categoryId.toString());
      if (params.productId)
        url.searchParams.append("productId", params.productId.toString());
      if (params.status) url.searchParams.append("status", params.status);
      if (params.period) url.searchParams.append("period", params.period);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Gagal mengambil data laporan penjualan: HTTP ${res.status}`,
      );
    }

    const response: ApiResponse<SalesReportData> = await res.json();

    if (!response.success || !response.data) {
      const errorMessage =
        response.message && response.message.length > 0
          ? response.message[0]
          : "Gagal memuat data laporan penjualan. Silakan coba lagi.";

      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    console.error("[dashboardService] fetchSalesReportData failed:", error);
    throw error;
  }
}
