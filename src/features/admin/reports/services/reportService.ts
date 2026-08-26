import { 
  ApiResponse, 
  SalesReportData, 
  SalesReportQuery, 
  ProductPerformanceData,
  DashboardReportData
} from '@/features/admin/reports/types/report.types';
import { apiClient } from '@/lib/api';

/**
 * Fetches the sales report data for the admin dashboard.
 * Uses native fetch with no-store to ensure reports are always up-to-date.
 * * @param query - Optional query parameters for filtering the report.
 * @returns Promise containing the SalesReportData.
 */
export async function getSalesReport(
  query?: SalesReportQuery
): Promise<SalesReportData> {
  try {
    // Construct the query string dynamically if parameters are provided
    const searchParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/admin/reports/sales${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient.get(endpoint, {
      cache: 'no-store', // Reports should not be cached to ensure accurate data
    });

    if (!res.ok) {
      // Throwing an Indonesian error message as it might be caught and shown to the user via toast
      throw new Error(`Gagal mengambil laporan penjualan: HTTP ${res.status}`);
    }

    // Explicitly cast the response to our manually defined type
    const response: ApiResponse<SalesReportData> = await res.json();

    if (!response.success || !response.data) {
      // Use the first message from the array if available, or a fallback Indonesian message
      throw new Error(response.message?.[0] || 'Gagal mengambil data laporan penjualan');
    }

    return response.data;
  } catch (error) {
    console.error('[salesReportService] getSalesReport failed:', error);
    throw error;
  }
}

/**
 * Fetches the product performance report data for the admin dashboard.
 * Uses native fetch with no-store to ensure reports are always up-to-date.
 * @param query - Optional query parameters for filtering the report (shares SalesReportQuery).
 * @returns Promise containing an array of ProductPerformanceData.
 */
export async function getProductPerformanceReport(
  query?: SalesReportQuery
): Promise<ProductPerformanceData[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/admin/reports/products${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient.get(endpoint, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil laporan performa produk: HTTP ${res.status}`);
    }

    const response: ApiResponse<ProductPerformanceData[]> = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || 'Gagal mengambil data laporan performa produk');
    }

    return response.data;
  } catch (error) {
    console.error('[salesReportService] getProductPerformanceReport failed:', error);
    throw error;
  }
}

/**
 * Fetches the general overview dashboard report data.
 * @param query - Optional query parameters (e.g., for date filtering).
 * @returns Promise containing the DashboardReportData.
 */
export async function getDashboardReport(
  query?: SalesReportQuery
): Promise<DashboardReportData> {
  try {
    const searchParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/admin/reports/dashboard${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient.get(endpoint, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil data dashboard: HTTP ${res.status}`);
    }

    const response: ApiResponse<DashboardReportData> = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || 'Gagal memuat data dashboard');
    }

    return response.data;
  } catch (error) {
    console.error('[salesReportService] getDashboardReport failed:', error);
    throw error;
  }
}

/**
 * Exports the sales report as a CSV file.
 * @param query - Optional query parameters for filtering the report.
 * @returns Promise containing the CSV Blob.
 */
export async function exportSalesReportCsv(
  query?: SalesReportQuery
): Promise<Blob> {
  try {
    const searchParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/admin/reports/sales/export${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient.get(endpoint, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Gagal mengunduh CSV laporan penjualan: HTTP ${res.status}`);
    }

    // Return as Blob instead of JSON for file handling
    return await res.blob();
  } catch (error) {
    console.error('[salesReportService] exportSalesReportCsv failed:', error);
    throw error;
  }
}

/**
 * Exports the product performance report as a CSV file.
 * @param query - Optional query parameters for filtering the report.
 * @returns Promise containing the CSV Blob.
 */
export async function exportProductPerformanceCsv(
  query?: SalesReportQuery
): Promise<Blob> {
  try {
    const searchParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/admin/reports/products/export${queryString ? `?${queryString}` : ''}`;

    const res = await apiClient.get(endpoint, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Gagal mengunduh CSV laporan performa produk: HTTP ${res.status}`);
    }

    // Return as Blob instead of JSON for file handling
    return await res.blob();
  } catch (error) {
    console.error('[salesReportService] exportProductPerformanceCsv failed:', error);
    throw error;
  }
}