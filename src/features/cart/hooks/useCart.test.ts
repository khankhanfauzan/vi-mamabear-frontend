import { renderHook, act } from "@testing-library/react";
import { useCartLogic } from "./useCart";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { cartService } from "@/features/cart/services/cartService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import type { Cart, CartItem } from "@/features/cart/types/cart.types";

// Mock next/navigation router since useCartLogic calls useRouter()
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Mock the auth hook so we can flip isLoggedIn per test
jest.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

// Mock sonner toast so we can assert on success/error notifications
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock cartService. `fetchCart` is included because the store re-runs
// initializeCart after applying/removing a promo, and the server response is
// what actually feeds cart state.
jest.mock("@/features/cart/services/cartService", () => ({
  cartService: {
    fetchCart: jest.fn(),
    validateCart: jest.fn(),
    applyPromoCode: jest.fn(),
    removePromoCode: jest.fn(),
  },
}));

const buildCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "item-1",
  cartId: "cart-1",
  productId: 1,
  variantId: 1,
  quantity: 2,
  price: "10000",
  createdAt: new Date().toISOString(),
  product: { id: 1, name: "Produk A", isActive: true },
  variant: {
    id: 1,
    name: "Varian A",
    priceIdr: "10000",
    stock: 5,
    productId: 1,
    weightG: 100,
  },
  ...overrides,
});

const buildCart = (overrides: Partial<Cart> = {}): Cart => ({
  id: "cart-1",
  userId: "user-1",
  sessionId: null,
  subtotalIdr: 0,
  taxIdr: 0,
  shippingCostIdr: 0,
  productDiscountIdr: 0,
  shippingDiscountIdr: 0,
  courierName: null,
  courierCode: null,
  shippingMethod: null,
  orderId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  expiresAt: new Date().toISOString(),
  items: [],
  totalWeight: 0,
  ...overrides,
});

describe("useCartLogic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the real zustand cart store state before every test. `cart` must be
    // cleared too: subtotal/discounts are derived from it, so a leaked cart
    // from a previous test would make totals non-deterministic.
    useCartStore.setState({
      cart: null,
      items: [],
      isLoading: false,
      isOpen: false,
    });
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: true });
  });

  it("computes subtotal and total quantity from the server cart", () => {
    useCartStore.setState({
      cart: buildCart({ subtotalIdr: 35000 }),
      items: [
        buildCartItem({ id: "1", price: "10000", quantity: 2 }),
        buildCartItem({ id: "2", price: "5000", quantity: 3 }),
      ],
    });

    const { result } = renderHook(() => useCartLogic());

    expect(result.current.subtotal).toBe(35000);
    expect(result.current.totalQuantity).toBe(5);
    expect(result.current.grandTotal).toBe(35000);
    expect(result.current.discountAmount).toBe(0);
  });

  it("applies a promo code confirmed by the server", async () => {
    useCartStore.setState({
      items: [buildCartItem({ id: "1", price: "10000", quantity: 1 })],
    });

    (cartService.applyPromoCode as jest.Mock).mockResolvedValue(buildCart());
    // After applyPromoCode the store re-fetches the cart; the server response
    // is what carries the applied promo and the recalculated discount.
    (cartService.fetchCart as jest.Mock).mockResolvedValue(
      buildCart({
        items: [buildCartItem({ id: "1", price: "10000", quantity: 1 })],
        subtotalIdr: 10000,
        promoCodeString: "MAMABEAR10",
        promoCode: {
          id: 1,
          code: "MAMABEAR10",
          discountType: "PRODUCT_PERCENTAGE",
          discountValue: "10",
        },
        productDiscountIdr: 1000,
      }),
    );

    const { result } = renderHook(() => useCartLogic());

    act(() => {
      result.current.setPromoCode("mamabear10");
    });
    await act(async () => {
      await result.current.handleApplyPromo();
    });

    expect(cartService.applyPromoCode).toHaveBeenCalledWith("mamabear10");
    expect(result.current.appliedPromo).toBe("MAMABEAR10");
    expect(result.current.subtotal).toBe(10000);
    expect(result.current.discountAmount).toBe(1000);
    expect(result.current.grandTotal).toBe(9000);
    expect(toast.success).toHaveBeenCalled();
  });

  it("surfaces an error when the server rejects a promo code", async () => {
    (cartService.applyPromoCode as jest.Mock).mockRejectedValue(
      new Error("Kode promo tidak valid"),
    );

    const { result } = renderHook(() => useCartLogic());

    act(() => {
      result.current.setPromoCode("INVALIDCODE");
    });
    await act(async () => {
      await result.current.handleApplyPromo();
    });

    expect(cartService.applyPromoCode).toHaveBeenCalledWith("INVALIDCODE");
    expect(result.current.appliedPromo).toBeNull();
    expect(result.current.promoError).toBe("Kode promo tidak valid");
    expect(toast.error).toHaveBeenCalled();
  });

  it("calculates a percentage discount when the server has not yet", () => {
    useCartStore.setState({
      cart: buildCart({
        subtotalIdr: 10000,
        promoCodeString: "MAMABEAR10",
        promoCode: {
          id: 1,
          code: "MAMABEAR10",
          discountType: "PRODUCT_PERCENTAGE",
          discountValue: "10",
        },
      }),
    });

    const { result } = renderHook(() => useCartLogic());

    expect(result.current.discountAmount).toBe(1000);
    expect(result.current.grandTotal).toBe(9000);
  });

  it("caps the fallback percentage discount at maxDiscountIdr", () => {
    useCartStore.setState({
      cart: buildCart({
        subtotalIdr: 100000,
        promoCodeString: "MAMABEAR25",
        promoCode: {
          id: 2,
          code: "MAMABEAR25",
          discountType: "PRODUCT_PERCENTAGE",
          discountValue: "10",
          maxDiscountIdr: 5000,
        },
      }),
    });

    const { result } = renderHook(() => useCartLogic());

    expect(result.current.discountAmount).toBe(5000);
    expect(result.current.grandTotal).toBe(95000);
  });

  it("never lets the discount exceed the subtotal", () => {
    useCartStore.setState({
      cart: buildCart({
        subtotalIdr: 10000,
        promoCodeString: "HUBAHGRATIS",
        promoCode: {
          id: 3,
          code: "HUBAHGRATIS",
          discountType: "PRODUCT_FIXED",
          discountValue: "50000",
        },
      }),
    });

    const { result } = renderHook(() => useCartLogic());

    expect(result.current.discountAmount).toBe(10000);
    expect(result.current.grandTotal).toBe(0);
  });

  it("blocks quantity updates that exceed available stock", async () => {
    useCartStore.setState({
      items: [buildCartItem({ id: "1", quantity: 1 })], // stock is 5
    });

    const { result } = renderHook(() => useCartLogic());

    await act(async () => {
      await result.current.updateQuantity("1", 10);
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining("Stok maksimum"),
    );
  });

  it("redirects guests to login when attempting to checkout", async () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: false });
    useCartStore.setState({
      items: [buildCartItem({ id: "1" })],
    });

    const { result } = renderHook(() => useCartLogic());

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(pushMock).toHaveBeenCalledWith(
      expect.stringContaining("/login?callbackUrl="),
    );
    expect(cartService.validateCart).not.toHaveBeenCalled();
  });

  it("redirects logged-in users to checkout when cart validation succeeds", async () => {
    (cartService.validateCart as jest.Mock).mockResolvedValue({ valid: true });
    useCartStore.setState({
      items: [buildCartItem({ id: "1" })],
    });

    const { result } = renderHook(() => useCartLogic());

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(cartService.validateCart).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("/checkout?items="));
  });

  it("shows an error and reloads the cart when validation reports invalid stock", async () => {
    (cartService.validateCart as jest.Mock).mockResolvedValue({ valid: false });
    const initializeCartSpy = jest
      .spyOn(useCartStore.getState(), "initializeCart")
      .mockResolvedValue(undefined);

    useCartStore.setState({
      items: [buildCartItem({ id: "1" })],
    });

    const { result } = renderHook(() => useCartLogic());

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(toast.error).toHaveBeenCalled();
    expect(initializeCartSpy).toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalledWith(
      expect.stringContaining("/checkout?items="),
    );
  });

  it("computes free shipping progress correctly", () => {
    useCartStore.setState({
      cart: buildCart({ subtotalIdr: 250000 }),
      items: [buildCartItem({ id: "1", price: "250000", quantity: 1 })],
    });

    const { result } = renderHook(() => useCartLogic());

    expect(result.current.freeShippingProgress).toBe(50); // 250000 / 500000 * 100
    expect(result.current.missingForFreeShipping).toBe(250000);
  });
});