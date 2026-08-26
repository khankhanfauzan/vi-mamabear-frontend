import {
  Order,
  OrderDetail,
  UpdateOrderStatusDto,
  UpdateTrackingDto,
  CancelOrderDto,
  InvoiceResponse,
  PaginatedOrders,
} from "@/features/admin/orders/types/adminOrder.types";

import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

/**
 * Fetches a paginated list of all orders for the admin dashboard.
 * @param queryParams Optional URLSearchParams for filtering, sorting, and pagination
 */
export async function fetchAdminOrders(
  queryParams?: URLSearchParams,
): Promise<PaginatedOrders> {
  try {
    const queryString = queryParams ? `?${queryParams.toString()}` : "";
    const res = await apiClient.get(`/admin/order${queryString}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil daftar pesanan: HTTP ${res.status}`);
    }

    // The API wraps the paginated result inside the `data` field of the standard ApiResponse
    const response: ApiResponse<PaginatedOrders> = await res.json();

    if (!response.success || !response.data) {
      throw new Error(
        response.message?.[0] || "Gagal mengambil daftar pesanan",
      );
    }

    return response.data;
  } catch (error) {
    console.error("[adminOrderService] fetchAdminOrders failed:", error);
    throw error;
  }
}

/**
 * Fetches the details of a single order by ID.
 * @param id Order ID
 */
export async function fetchAdminOrderById(id: string): Promise<OrderDetail> {
  try {
    const res = await apiClient.get(`/admin/order/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil detail pesanan: HTTP ${res.status}`);
    }

    const response: ApiResponse<OrderDetail> = await res.json();

    if (!response.success || !response.data) {
      throw new Error(
        response.message?.[0] || "Gagal mengambil detail pesanan",
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      `[adminOrderService] fetchAdminOrderById failed for id ${id}:`,
      error,
    );
    throw error;
  }
}

/**
 * Updates the status of an existing order.
 * @param id Order ID
 * @param payload The new status payload
 */
export async function updateAdminOrderStatus(
  id: string,
  payload: UpdateOrderStatusDto,
): Promise<Order> {
  try {
    const res = await apiClient.patch(`/admin/order/${id}/status`, payload);
    const result: ApiResponse<Order> = await res.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message?.[0] || "Gagal memperbarui status pesanan",
      );
    }

    return result.data;
  } catch (error) {
    console.error(
      `[adminOrderService] updateAdminOrderStatus failed for id ${id}:`,
      error,
    );
    throw error;
  }
}

/**
 * Updates the tracking information (nomor resi) for a shipped order.
 * @param id Order ID
 * @param payload The tracking data payload
 */
export async function updateAdminOrderTracking(
  id: string,
  payload: UpdateTrackingDto,
): Promise<Order> {
  try {
    const res = await apiClient.patch(`/admin/order/${id}/tracking`, payload);
    const result: ApiResponse<Order> = await res.json();

    if (!result.success || !result.data) {
      throw new Error(result.message?.[0] || "Gagal memperbarui nomor resi");
    }

    return result.data;
  } catch (error) {
    console.error(
      `[adminOrderService] updateAdminOrderTracking failed for id ${id}:`,
      error,
    );
    throw error;
  }
}

/**
 * Retrieves the invoice details or URL for a specific order.
 * @param id Order ID
 */
export async function fetchAdminOrderInvoice(
  id: string,
): Promise<InvoiceResponse> {
  try {
    const res = await apiClient.get(`/admin/order/${id}/invoice`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil invoice: HTTP ${res.status}`);
    }

    const response: ApiResponse<InvoiceResponse> = await res.json();

    if (!response.success || !response.data) {
      throw new Error(
        response.message?.[0] || "Gagal mengambil invoice pesanan",
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      `[adminOrderService] fetchAdminOrderInvoice failed for id ${id}:`,
      error,
    );
    throw error;
  }
}

/**
 * Cancels an order, optionally providing cancellation notes/reasons.
 * @param id Order ID
 * @param payload The cancellation notes
 */
export async function cancelAdminOrder(
  id: string,
  payload?: CancelOrderDto,
): Promise<Order> {
  try {
    // Assuming cancellation is a POST or PATCH action. Used POST as it executes a specific business process.
    const res = await apiClient.post(
      `/admin/order/${id}/cancel`,
      payload || {},
    );
    const result: ApiResponse<Order> = await res.json();

    if (!result.success || !result.data) {
      throw new Error(result.message?.[0] || "Gagal membatalkan pesanan");
    }

    return result.data;
  } catch (error) {
    console.error(
      `[adminOrderService] cancelAdminOrder failed for id ${id}:`,
      error,
    );
    throw error;
  }
}

/**
 * Exports current order listing into a CSV file.
 * @param queryParams Current filters and sorting search params
 */
export async function exportAdminOrdersCSV(
  queryParams?: URLSearchParams,
): Promise<Blob> {
  try {
    const queryString = queryParams ? `?${queryParams.toString()}` : "";
    const res = await apiClient.get(`/admin/order/export${queryString}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengekspor pesanan: HTTP ${res.status}`);
    }

    return await res.blob();
  } catch (error) {
    console.error("[adminOrderService] exportAdminOrdersCSV failed:", error);
    throw error;
  }
}
