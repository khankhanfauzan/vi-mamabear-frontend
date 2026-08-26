import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types";
import {
  CreateOrderPayload,
  Order,
  InvoiceData,
  PaginatedOrders,
} from "../types/order.types";

export interface GetOrdersParams {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: string | string[]; // Mendukung satu status atau array dari banyak status
  customer?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Service to handle orders creation and management.
 */

/**
 * Creates a new order in the system.
 * Uses apiClient mutation.
 *
 * @param payload - The checkout form / selection payload
 * @returns Promise<Order> - The created order details
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    const res = await apiClient.post(`/order`, payload);

    if (!res.ok) {
      throw new Error(`Gagal membuat order: HTTP ${res.status}`);
    }

    // Explicitly casting the response based on ApiResponse structure
    const response = (await res.json()) as ApiResponse<Order>;

    if (!response.success || !response.data) {
      const errorMessage = Array.isArray(response.message)
        ? response.message[0]
        : (response.message ?? "Terjadi kesalahan saat memproses pesanan Anda");
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    console.error("[orderService] createOrder failed:", error);
    throw error;
  }
}

/**
 * Fetches order details by ID.
 *
 * @param orderId - The ID of the order to retrieve
 * @returns Promise<Order>
 */
export async function getOrderById(orderId: string): Promise<Order> {
  try {
    const res = await apiClient.get(`/order/${orderId}`);

    if (!res.ok) {
      throw new Error(`Gagal mengambil detail order: HTTP ${res.status}`);
    }

    const response = (await res.json()) as ApiResponse<Order>;

    if (!response.success || !response.data) {
      throw new Error(
        Array.isArray(response.message)
          ? response.message[0]
          : "Pesanan tidak ditemukan",
      );
    }

    return response.data;
  } catch (error) {
    console.error(`[orderService] getOrderById(${orderId}) failed:`, error);
    throw error;
  }
}

/**
 * Fetches a list of orders based on the provided query parameters.
 *
 * @param params - Filter, search, and pagination parameters
 * @returns Promise<PaginatedOrders>
 */
export async function getOrders(params?: GetOrdersParams): Promise<PaginatedOrders> {
  try {
    const query = new URLSearchParams();

    if (params) {
      if (params.cursor) query.append("cursor", params.cursor);
      if (params.limit) query.append("limit", params.limit.toString());
      if (params.search) query.append("search", params.search);
      
      // Handle array of statuses or a single status
      if (params.status) {
        if (Array.isArray(params.status)) {
          params.status.forEach((s) => query.append("status", s));
        } else {
          query.append("status", params.status);
        }
      }
      
      if (params.customer) query.append("customer", params.customer);
      if (params.startDate) query.append("startDate", params.startDate);
      if (params.endDate) query.append("endDate", params.endDate);
    }

    const queryString = query.toString();
    const endpoint = queryString ? `/order?${queryString}` : `/order`;

    const res = await apiClient.get(endpoint);

    if (!res.ok) {
      throw new Error(`Gagal mengambil daftar pesanan: HTTP ${res.status}`);
    }

    // Menggunakan PaginatedOrders sebagai tipe data pada ApiResponse
    const response = (await res.json()) as ApiResponse<PaginatedOrders>;

    if (!response.success || !response.data) {
      throw new Error(
        Array.isArray(response.message)
          ? response.message[0]
          : (response.message ?? "Terjadi kesalahan saat mengambil daftar pesanan")
      );
    }

    // Mengembalikan objek PaginatedOrders seutuhnya
    return response.data;
  } catch (error) {
    console.error("[orderService] getOrders failed:", error);
    throw error;
  }
}

/**
 * Fetches the invoice details or URL for a specific order.
 *
 * @param orderId - The ID of the order
 * @returns Promise<InvoiceData>
 */
export async function getInvoice(orderId: string): Promise<InvoiceData> {
  try {
    const res = await apiClient.get(`/order/${orderId}/invoice`);

    if (!res.ok) {
      throw new Error(`Gagal mengambil invoice: HTTP ${res.status}`);
    }

    const response = (await res.json()) as ApiResponse<InvoiceData>;

    if (!response.success || !response.data) {
      throw new Error(
        Array.isArray(response.message)
          ? response.message[0]
          : "Invoice tidak ditemukan",
      );
    }

    return response.data;
  } catch (error) {
    console.error(`[orderService] getInvoice(${orderId}) failed:`, error);
    throw error;
  }
}

export const orderService = {
  createOrder,
  getOrderById,
  getOrders,
  getInvoice,
};
