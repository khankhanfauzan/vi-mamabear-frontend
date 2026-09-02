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

/**
 * Helper to parse the response safely.
 * Handles both raw returns and { data: ... } wrapped returns from NestJS interceptors.
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || `HTTP Error ${response.status}`);
  }

  // If backend wrapped it in a "data" object, extract it. Otherwise, return raw json.
  return json.data !== undefined ? json.data : json;
}

export async function fetchCart(): Promise<Cart | null> {
  try {
    const res = await apiClient.get(`/cart`, {
      ...defaultOptions,
      cache: "no-store", // Cart is highly dynamic, never cache statically
    });

    if (res.status === 404) return null;
    return await parseResponse<Cart>(res);
  } catch (error) {
    console.error("[cartService] fetchCart failed:", error);
    return null;
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