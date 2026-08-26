import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types"; // Adjust import path based on global api types
import { CreatePaymentPayload, PaymentTransaction } from "../types/payment.types";

/**
 * Services to orchestrate transaction processing and payments.
 */

/**
 * Request payment session / Midtrans snap token creation for a pending order.
 * 
 * @param payload - The order detail and customer contact data payload
 * @returns Promise<PaymentTransaction> - Midtrans transaction tokens
 */
export async function createPayment(payload: CreatePaymentPayload): Promise<PaymentTransaction> {
  try {
    const res = await apiClient.post(`/payment/create`, payload);

    if (!res.ok) {
      throw new Error(`Gagal membuat sesi pembayaran: HTTP ${res.status}`);
    }

    const response: ApiResponse<PaymentTransaction> = await res.json();

    if (!response.success || !response.data) {
      const errorMessage = Array.isArray(response.message)
        ? response.message[0]
        : response.message;
      throw new Error(errorMessage || "Terjadi kesalahan saat menginisialisasi pembayaran");
    }

    return response.data;
  } catch (error) {
    console.error("[paymentService] createPayment failed:", error);
    throw error;
  }
}

export const paymentService = {
  createPayment,
};