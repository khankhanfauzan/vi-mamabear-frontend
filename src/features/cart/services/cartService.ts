import { Cart, CartItem } from "@/features/cart/types/cart.types";
import { apiClient } from "@/lib/api";

export interface AddToCartPayload {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface UpdateCourierPayload {
  shippingCostIdr: number;
  courierName: string;
  courierCode: string;
  shippingMethod: string;
}

/**
 * Shared options to ensure cookies are included for the NestJS backend.
 * This works in tandem with apiClient to send both the JWT and the Cookie.
 */
const defaultOptions: RequestInit = {
  credentials: "include",
};

type ResponsePayload<T = unknown> = {
  data?: T;
  message?: string | string[];
  success?: boolean;
  statusCode?: number;
  error?: string;
};

const isResponsePayload = (value: unknown): value is ResponsePayload =>
  typeof value === "object" && value !== null;

const getResponseErrorMessage = (
  payload: unknown,
  status: number,
): string => {
  if (isResponsePayload(payload)) {
    if (Array.isArray(payload.message)) {
      const messages = payload.message.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      );

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }

    if (typeof payload.message === "string" && payload.message.trim().length > 0) {
      return payload.message;
    }

    if (typeof payload.error === "string" && payload.error.trim().length > 0) {
      return payload.error;
    }
  }

  return `HTTP Error ${status}`;
};

/**
 * Parses both raw payloads and the backend's { data: ... } envelope.
 *
 * DELETE endpoints can legitimately return 204 without a JSON body, and some
 * gateways return a non-JSON body for failures. Those responses should still
 * produce a predictable service result/error instead of leaking a JSON parse
 * exception to callers.
 */
async function parseResponse<T>(response: Response): Promise<T> {
  let payload: unknown;

  if (response.status !== 204) {
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }
  }

  if (!response.ok) {
    throw new Error(getResponseErrorMessage(payload, response.status));
  }

  if (isResponsePayload(payload) && payload.success === false) {
    throw new Error(getResponseErrorMessage(payload, response.status));
  }

  if (isResponsePayload(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export async function fetchCart(): Promise<Cart | null> {
  try {
    const res = await apiClient.get(`/cart`, {
      ...defaultOptions,
      cache: "no-store", // Cart is highly dynamic, never cache statically
    });

    if (res.status === 404) return null;
    const cart = await parseResponse<Cart | null>(res);
    return cart ?? null;
  } catch (error) {
    console.error("[cartService] fetchCart failed:", error);
    throw error;
  }
}

export async function mergeCart(): Promise<Cart> {
  try {
    // Pass undefined for body since /cart/merge doesn't require a payload
    const res = await apiClient.post(`/cart/merge`, undefined, defaultOptions);
    return await parseResponse<Cart>(res);
  } catch (error) {
    console.error(`[cartService] mergeCart failed:`, error);
    throw error;
  }
}

export interface CartValidationResult {
  valid: boolean;
}

export async function validateCart(): Promise<CartValidationResult> {
  try {
    const res = await apiClient.post(`/cart/validate`, undefined, defaultOptions);
    return await parseResponse<CartValidationResult>(res);
  } catch (error) {
    console.error(`[cartService] validateCart failed:`, error);
    throw error;
  }
}

export async function addToCart(payload: AddToCartPayload): Promise<CartItem> {
  try {
    const res = await apiClient.post(`/cart/items`, payload, defaultOptions);
    return await parseResponse<CartItem>(res);
  } catch (error) {
    console.error(`[cartService] addToCart failed:`, error);
    throw error;
  }
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<CartItem> {
  try {
    const res = await apiClient.patch(
      `/cart/items/${itemId}`,
      { quantity },
      defaultOptions,
    );
    return await parseResponse<CartItem>(res);
  } catch (error) {
    console.error(`[cartService] updateCartItemQuantity failed:`, error);
    throw error;
  }
}

export async function updateCartItemCourier(
  cartId: string,
  payload: UpdateCourierPayload,
): Promise<Cart> {
  try {
    const res = await apiClient.patch(
      `/cart/${cartId}/courier`,
      payload,
      defaultOptions,
    );
    return await parseResponse<Cart>(res);
  } catch (error) {
    console.error(`[cartService] updateCartItemCourier failed:`, error);
    throw error;
  }
}

export async function removeCartItem(itemId: string): Promise<void> {
  try {
    const res = await apiClient.delete(`/cart/items/${itemId}`, defaultOptions);
    await parseResponse(res);
  } catch (error) {
    console.error(`[cartService] removeCartItem failed:`, error);
    throw error;
  }
}

export async function clearCart(): Promise<void> {
  try {
    const res = await apiClient.delete(`/cart`, defaultOptions);
    await parseResponse(res);
  } catch (error) {
    console.error(`[cartService] clearCart failed:`, error);
    throw error;
  }
}

export const cartService = {
  fetchCart,
  addToCart,
  updateCartItemQuantity,
  updateCartItemCourier,
  removeCartItem,
  clearCart,
  mergeCart,
  validateCart,
};
