import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types"; // Adjust import path based on global api types
import { CreateOrderPayload, Order } from "../types/checkoutOrder.types";

/**
 * Service to handle orders creation and management.
 */

/**
 * Creates a new order in the system.
 * Uses apiClient mutation.
 *
 * @param payload - The checkout form / selection payload
 * @returns Promise<Order> - The created order schema details
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    const res = await apiClient.post(`/order`, payload);

    if (!res.ok) {
      throw new Error(`Gagal membuat order: HTTP ${res.status}`);
    }

    const response: ApiResponse<Order> = await res.json();

    if (!response.success || !response.data) {
      const errorMessage = Array.isArray(response.message)
        ? response.message[0]
        : response.message;
      throw new Error(
        errorMessage || "Terjadi kesalahan saat memproses pesanan Anda",
      );
    }

    return response.data;
  } catch (error) {
    console.error("[orderService] createOrder failed:", error);
    throw error;
  }
}

export const orderService = {
  createOrder,
};
