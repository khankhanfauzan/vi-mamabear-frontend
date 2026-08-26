import {
  fetchCart,
  addToCart,
  updateCartItemQuantity,
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

const mockResponse = (body: unknown, ok = true, status = 200) =>
  ({
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  }) as unknown as Response;

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
        mockResponse({ data: cart }),
      );

      const result = await fetchCart();

      expect(apiClient.get).toHaveBeenCalledWith(
        "/cart",
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(cart);
    });

    it("returns null when the backend responds with 404", async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse({}, true, 404));

      const result = await fetchCart();

      expect(result).toBeNull();
    });

    it("returns null and logs the error instead of throwing on network failure", async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error("network down"));

      const result = await fetchCart();

      expect(result).toBeNull();
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

    it("throws an error using the backend message when the request fails", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ message: "Stok tidak cukup" }, false, 400),
      );

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 99 }),
      ).rejects.toThrow("Stok tidak cukup");
    });

    it("falls back to a generic HTTP error message when none is provided", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse({}, false, 500));

      await expect(
        addToCart({ productId: 1, variantId: 1, quantity: 1 }),
      ).rejects.toThrow("HTTP Error 500");
    });
  });

  describe("updateCartItemQuantity", () => {
    it("sends a PATCH request with the new quantity", async () => {
      const updatedItem = { id: "item-1", quantity: 5 };
      (apiClient.patch as jest.Mock).mockResolvedValue(mockResponse(updatedItem));

      const result = await updateCartItemQuantity("item-1", 5);

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/cart/items/item-1",
        { quantity: 5 },
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(updatedItem);
    });
  });

  describe("removeCartItem", () => {
    it("sends a DELETE request for the given item id", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse({}));

      await removeCartItem("item-1");

      expect(apiClient.delete).toHaveBeenCalledWith(
        "/cart/items/item-1",
        expect.objectContaining({ credentials: "include" }),
      );
    });
  });

  describe("clearCart", () => {
    it("sends a DELETE request to clear the whole cart", async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse({}));

      await clearCart();

      expect(apiClient.delete).toHaveBeenCalledWith(
        "/cart",
        expect.objectContaining({ credentials: "include" }),
      );
    });

    it("rethrows on failure", async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error("failed"));

      await expect(clearCart()).rejects.toThrow("failed");
    });
  });

  describe("mergeCart", () => {
    it("posts to /cart/merge with no body", async () => {
      const cart = { id: "cart-1" };
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse(cart));

      const result = await mergeCart();

      expect(apiClient.post).toHaveBeenCalledWith(
        "/cart/merge",
        undefined,
        expect.objectContaining({ credentials: "include" }),
      );
      expect(result).toEqual(cart);
    });
  });

  describe("validateCart", () => {
    it("returns the validation result from the backend", async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(
        mockResponse({ valid: true }),
      );

      const result = await validateCart();

      expect(result).toEqual({ valid: true });
    });
  });
});
