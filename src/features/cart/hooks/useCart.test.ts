import { renderHook, act } from "@testing-library/react";
import { useCartLogic } from "./useCart";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { cartService } from "@/features/cart/services/cartService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import type { CartItem } from "@/features/cart/types/cart.types";

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

// Mock cartService (used directly for checkout validation)
jest.mock("@/features/cart/services/cartService", () => ({
  cartService: {
    validateCart: jest.fn(),
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

describe("useCartLogic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the real zustand cart store state before every test
    useCartStore.setState({
      items: [],
      isLoading: false,
      isOpen: false,
    });
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: true });
  });

  it("computes subtotal and total quantity from cart items", () => {
    useCartStore.setState({
      items: [
        buildCartItem({ id: "1", price: "10000", quantity: 2 }),
        buildCartItem({ id: "2", price: "5000", quantity: 3 }),
      ],
    });

    const { result } = renderHook(() => useCartLogic());

    expect(result.current.subtotal).toBe(35000); // 10000*2 + 5000*3
    expect(result.current.totalQuantity).toBe(5);
    expect(result.current.grandTotal).toBe(35000);
    expect(result.current.discountAmount).toBe(0);
  });

  it("applies a 10% discount when the correct promo code is used", () => {
    useCartStore.setState({
      items: [buildCartItem({ id: "1", price: "10000", quantity: 1 })],
    });

    const { result } = renderHook(() => useCartLogic());

    act(() => {
      result.current.setPromoCode("mamabear10");
    });
    act(() => {
      result.current.handleApplyPromo();
    });

    expect(result.current.appliedPromo).toBe("MAMABEAR10");
    expect(result.current.discountAmount).toBe(1000); // 10% of 10000
    expect(result.current.grandTotal).toBe(9000);
    expect(toast.success).toHaveBeenCalled();
  });

  it("rejects an invalid promo code", () => {
    const { result } = renderHook(() => useCartLogic());

    act(() => {
      result.current.setPromoCode("INVALIDCODE");
    });
    act(() => {
      result.current.handleApplyPromo();
    });

    expect(result.current.appliedPromo).toBeNull();
    expect(toast.error).toHaveBeenCalled();
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
      items: [buildCartItem({ id: "1", price: "250000", quantity: 1 })],
    });

    const { result } = renderHook(() => useCartLogic());

    expect(result.current.freeShippingProgress).toBe(50); // 250000 / 500000 * 100
    expect(result.current.missingForFreeShipping).toBe(250000);
  });
});
