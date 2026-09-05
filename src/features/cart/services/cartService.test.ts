import {
  fetchCart,
  addToCart,
  updateCartItemQuantity,
  updateCartItemCourier,
  removeCartItem,
  clearCart,
  mergeCart,
  validateCart,
} from "./cartService";
import { apiClient } from "@/lib/api";

// Mock the low-level apiClient so we can control the Response shape returned
// to the service functions without hitting the network.
jest.mock("@/lib/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

/**
 * Creates a mock Response object with realistic ok/status consistency:
 * - 2xx responses have ok: true
 * - 4xx / 5xx responses have ok: false
 */
const mockResponse = (body: unknown, ok = true, status = 200) => {
  if (status >= 200 && status < 300 && !ok) {
    throw new Error(`Invalid test mock: 2xx status ${status} cannot have ok: false`);
  }
  if ((status < 200 || status >= 300) && ok) {
    throw new Error(
      `Invalid test mock: status ${status} cannot have ok: true. Real fetch sets ok: false for non-2xx status.`,
    );
  }
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
};

describe("cartService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchCart", () => {
    it("returns unwrapped data when the backend wraps the response in { data }", async () => {
      const cart = { id: "cart-1", items: [] };
      (apiClient.get as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200, data: cart }),
      );

      const result = await fetchCart();

      expect(apiClient.get).toHaveBeenCalledWith(
        "/cart",
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(cart);
    });

    it("returns unwrapped data when the backend returns raw cart without envelope", async () => {
      const cart = { id: "cart-1", items: [] };
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse(cart));

      const result = await fetchCart();
      expect(result).toEqual(cart);
    });

    it("returns null when backend responds with { success: true, data: null }", async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200, data: null }),
      );

      const result = await fetchCart();
      expect(result).toBeNull();
    });

    it("returns null when the backend responds with 404", async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Cart not found" }, false, 404),
      );

      const result = await fetchCart();

      expect(result).toBeNull();
    });

    it("returns null without calling response.json when response is 204 No Content", async () => {
      const response = mockResponse(undefined, true, 204);
      (apiClient.get as jest.Mock).mockResolvedValue(response);

      await expect(fetchCart()).resolves.toBeNull();
      expect(response.json).not.toHaveBeenCalled();
    });

    it("throws and logs the error on network failure instead of swallowing it", async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error("network down"));

      await expect(fetchCart()).rejects.toThrow("network down");
      expect(console.error).toHaveBeenCalledWith(
        "[cartService] fetchCart failed:",
        expect.any(Error),
      );
    });

    it("throws when backend responds with HTTP 500 error", async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Internal server error" }, false, 500),
      );

      await expect(fetchCart()).rejects.toThrow("Internal server error");
    });

    it("throws when backend responds with HTTP 4xx error (other than 404)", async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(
        mockResponse(
          { success: false, statusCode: 400, message: ["Invalid session"] },
          false,
          400,
        ),
      );

      await expect(fetchCart()).rejects.toThrow("Invalid session");
    });

    it("throws when backend responds with 200 but success is false", async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(
        mockResponse(
          { success: false, statusCode: 200, message: "Gagal memuat keranjang" },
          true,
          200,
        ),
      );

      await expect(fetchCart()).rejects.toThrow("Gagal memuat keranjang");
    });
  });

  describe("addToCart", () => {
    it("posts the payload and returns the created cart item", async () => {
      const cartItem = { id: "item-1", quantity: 2 };
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse(cartItem));

      const result = await addToCart({ productId: 1, variantId: 1, quantity: 2 });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/cart/items",
        { productId: 1, variantId: 1, quantity: 2 },
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(cartItem);
    });

    it("unwraps a successful API envelope", async () => {
      const cartItem = { id: "item-1", quantity: 2 };
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200, data: cartItem }),
      );

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 2 }),
      ).resolves.toEqual(cartItem);
    });

    it("throws the API message when the response envelope reports failure", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ success: false, message: "Keranjang tidak tersedia" }),
      );

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 1 }),
      ).rejects.toThrow("Keranjang tidak tersedia");
    });

    it("throws an error using the backend message when the request fails with HTTP 4xx", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Stok tidak cukup" }, false, 400),
      );

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 99 }),
      ).rejects.toThrow("Stok tidak cukup");
    });

    it("handles backend error message returned as an array", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse(
          {
            success: false,
            statusCode: 400,
            message: ["Stok tidak cukup", "Maksimal pemesanan 5"],
            data: null,
          },
          false,
          400,
        ),
      );

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 99 }),
      ).rejects.toThrow("Stok tidak cukup, Maksimal pemesanan 5");
    });

    it("falls back to a generic HTTP error message when none is provided on HTTP 5xx", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse({}, false, 500));

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 1 }),
      ).rejects.toThrow("HTTP Error 500");
    });

    it("rethrows on network failure", async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 1 }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("updateCartItemQuantity", () => {
    it("sends a PATCH request with the new quantity", async () => {
      const updatedItem = { id: "item-1", quantity: 5 };
      (apiClient.patch as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200, data: updatedItem }),
      );

      const result = await updateCartItemQuantity("item-1", 5);

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/cart/items/item-1",
        { quantity: 5 },
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(updatedItem);
    });

    it("throws on HTTP 4xx error", async () => {
      (apiClient.patch as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Item tidak ditemukan" }, false, 404),
      );

      await expect(updateCartItemQuantity("item-1", 5)).rejects.toThrow(
        "Item tidak ditemukan",
      );
    });

    it("throws on HTTP 5xx error", async () => {
      (apiClient.patch as jest.Mock).mockResolvedValue(
        mockResponse({}, false, 500),
      );

      await expect(updateCartItemQuantity("item-1", 5)).rejects.toThrow(
        "HTTP Error 500",
      );
    });

    it("rethrows on network failure", async () => {
      (apiClient.patch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(updateCartItemQuantity("item-1", 5)).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("updateCartItemCourier", () => {
    it("sends the courier payload for the selected cart", async () => {
      const payload = {
        shippingCostIdr: 12000,
        courierName: "JNE",
        courierCode: "jne",
        shippingMethod: "REG",
      };
      const cart = { id: "cart-1", shippingCostIdr: 12000 };
      (apiClient.patch as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200, data: cart }),
      );

      const result = await updateCartItemCourier("cart-1", payload);

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/cart/cart-1/courier",
        payload,
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(cart);
    });

    it("throws on HTTP 4xx error", async () => {
      (apiClient.patch as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Kurir tidak valid" }, false, 400),
      );

      await expect(
        updateCartItemCourier("cart-1", {
          shippingCostIdr: 12000,
          courierName: "JNE",
          courierCode: "jne",
          shippingMethod: "REG",
        }),
      ).rejects.toThrow("Kurir tidak valid");
    });

    it("rethrows on network failure", async () => {
      (apiClient.patch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(
        updateCartItemCourier("cart-1", {
          shippingCostIdr: 12000,
          courierName: "JNE",
          courierCode: "jne",
          shippingMethod: "REG",
        }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("removeCartItem", () => {
    it("sends a DELETE request for the given item id", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200 }),
      );

      await removeCartItem("item-1");

      expect(apiClient.delete).toHaveBeenCalledWith(
        "/cart/items/item-1",
        expect.objectContaining({ credentials: "include" }),
      );
    });

    it("accepts a successful 204 response without calling response.json", async () => {
      const response = mockResponse(undefined, true, 204);
      (apiClient.delete as jest.Mock).mockResolvedValue(response);

      await expect(removeCartItem("item-1")).resolves.toBeUndefined();
      expect(response.json).not.toHaveBeenCalled();
    });

    it("throws on HTTP 4xx error", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Item tidak ditemukan" }, false, 404),
      );

      await expect(removeCartItem("item-1")).rejects.toThrow(
        "Item tidak ditemukan",
      );
    });

    it("throws on HTTP 5xx error", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(
        mockResponse({}, false, 500),
      );

      await expect(removeCartItem("item-1")).rejects.toThrow("HTTP Error 500");
    });

    it("rethrows on network failure", async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(removeCartItem("item-1")).rejects.toThrow("Network error");
    });
  });

  describe("clearCart", () => {
    it("sends a DELETE request to clear the whole cart", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200 }),
      );

      await clearCart();

      expect(apiClient.delete).toHaveBeenCalledWith(
        "/cart",
        expect.objectContaining({ credentials: "include" }),
      );
    });

    it("accepts a successful 204 response without calling response.json", async () => {
      const response = mockResponse(undefined, true, 204);
      (apiClient.delete as jest.Mock).mockResolvedValue(response);

      await expect(clearCart()).resolves.toBeUndefined();
      expect(response.json).not.toHaveBeenCalled();
    });

    it("throws on HTTP 5xx failure", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Server error" }, false, 500),
      );

      await expect(clearCart()).rejects.toThrow("Server error");
    });

    it("rethrows on network failure", async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(clearCart()).rejects.toThrow("network error");
    });
  });

  describe("mergeCart", () => {
    it("posts to /cart/merge with no body", async () => {
      const cart = { id: "cart-1" };
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200, data: cart }),
      );

      const result = await mergeCart();

      expect(apiClient.post).toHaveBeenCalledWith(
        "/cart/merge",
        undefined,
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(cart);
    });

    it("throws on HTTP 4xx error", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Sesi kedaluwarsa" }, false, 401),
      );

      await expect(mergeCart()).rejects.toThrow("Sesi kedaluwarsa");
    });

    it("rethrows on network failure", async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(mergeCart()).rejects.toThrow("network error");
    });
  });

  describe("validateCart", () => {
    it("returns the validation result from the backend envelope", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ success: true, statusCode: 200, data: { valid: true } }),
      );

      const result = await validateCart();

      expect(apiClient.post).toHaveBeenCalledWith(
        "/cart/validate",
        undefined,
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual({ valid: true });
    });

    it("throws on HTTP 4xx error", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Keranjang tidak valid" }, false, 400),
      );

      await expect(validateCart()).rejects.toThrow("Keranjang tidak valid");
    });

    it("rethrows on network failure", async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error("network error"));

      await expect(validateCart()).rejects.toThrow("network error");
    });
  });
});
