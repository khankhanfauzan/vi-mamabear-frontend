import { useCartStore } from "./use-cart-store";
import { cartService } from "@/features/cart/services/cartService";
import type {
  ProductDetail,
  ProductVariant,
} from "@/features/products/types/product.types";
import type { CartItem, Cart } from "@/features/cart/types/cart.types";

// Mock the service layer so the store's async actions can be tested in
// isolation, without hitting the real backend.
jest.mock("@/features/cart/services/cartService", () => ({
  cartService: {
    fetchCart: jest.fn(),
    mergeCart: jest.fn(),
    addToCart: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    removeCartItem: jest.fn(),
    clearCart: jest.fn(),
  },
}));

const buildProduct = (overrides: Partial<ProductDetail> = {}): ProductDetail =>
  ({
    id: 1,
    name: "Produk A",
    images: [],
    ...overrides,
  }) as ProductDetail;

const buildVariant = (overrides: Partial<ProductVariant> = {}): ProductVariant =>
  ({
    id: 1,
    productId: 1,
    name: "Varian A",
    priceIdr: "10000",
    stock: 5,
    ...overrides,
  }) as ProductVariant;

const buildCartItem = (overrides: Partial<CartItem> = {}): CartItem =>
  ({
    id: "item-1",
    cartId: "cart-1",
    productId: 1,
    variantId: 1,
    quantity: 1,
    price: "10000",
    createdAt: new Date().toISOString(),
    ...overrides,
  }) as CartItem;

describe("useCartStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCartStore.setState({ items: [], isLoading: false, isOpen: false });
  });

  describe("initializeCart", () => {
    it("populates items from the backend cart", async () => {
      const dbCart: Cart = {
        id: "cart-1",
        userId: null,
        sessionId: "s1",
        subtotalIdr: 10000,
        taxIdr: 0,
        shippingCostIdr: 0,
        courierName: null,
        courierCode: null,
        shippingMethod: null,
        orderId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
        items: [buildCartItem()],
        totalWeight: 100,
      };
      (cartService.fetchCart as jest.Mock).mockResolvedValue(dbCart);

      await useCartStore.getState().initializeCart();

      expect(useCartStore.getState().items).toEqual(dbCart.items);
      expect(useCartStore.getState().isLoading).toBe(false);
    });

    it("clears items when the backend has no cart", async () => {
      useCartStore.setState({ items: [buildCartItem()] });
      (cartService.fetchCart as jest.Mock).mockResolvedValue(null);

      await useCartStore.getState().initializeCart();

      expect(useCartStore.getState().items).toEqual([]);
    });

    it("keeps isLoading false and logs the error when fetchCart throws", async () => {
      (cartService.fetchCart as jest.Mock).mockRejectedValue(
        new Error("network error"),
      );
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await useCartStore.getState().initializeCart();

      expect(useCartStore.getState().isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("addItem", () => {
    it("appends a new item built from frontend product/variant data", async () => {
      const dbItem = buildCartItem({ id: "new-item", quantity: 2 });
      (cartService.addToCart as jest.Mock).mockResolvedValue(dbItem);

      const product = buildProduct();
      const variant = buildVariant();

      await useCartStore.getState().addItem({ product, variant, quantity: 2 });

      const { items, isOpen } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("new-item");
      expect(items[0].product.id).toBe(product.id);
      expect(items[0].variant.id).toBe(variant.id);
      expect(isOpen).toBe(true);
    });

    it("updates the quantity of an existing item instead of duplicating it", async () => {
      const product = buildProduct();
      const variant = buildVariant();

      useCartStore.setState({
        items: [
          buildCartItem({
            id: "existing",
            productId: product.id,
            variantId: variant.id,
            quantity: 1,
          }),
        ],
      });

      (cartService.addToCart as jest.Mock).mockResolvedValue(
        buildCartItem({ id: "existing", quantity: 3 }),
      );

      await useCartStore.getState().addItem({ product, variant, quantity: 2 });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it("throws and rethrows when the service call fails", async () => {
      (cartService.addToCart as jest.Mock).mockRejectedValue(
        new Error("failed to add"),
      );
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(
        useCartStore.getState().addItem({
          product: buildProduct(),
          variant: buildVariant(),
          quantity: 1,
        }),
      ).rejects.toThrow("failed to add");

      expect(useCartStore.getState().isLoading).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe("updateQuantity", () => {
    it("updates the quantity of the matching item", async () => {
      useCartStore.setState({ items: [buildCartItem({ id: "1", quantity: 1 })] });
      (cartService.updateCartItemQuantity as jest.Mock).mockResolvedValue(
        buildCartItem({ id: "1", quantity: 4 }),
      );

      await useCartStore.getState().updateQuantity("1", 4);

      expect(useCartStore.getState().items[0].quantity).toBe(4);
    });
  });

  describe("removeItem", () => {
    it("removes the item with the matching id", async () => {
      useCartStore.setState({
        items: [buildCartItem({ id: "1" }), buildCartItem({ id: "2" })],
      });
      (cartService.removeCartItem as jest.Mock).mockResolvedValue(undefined);

      await useCartStore.getState().removeItem("1");

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("2");
    });
  });

  describe("clearCart", () => {
    it("empties all items on success", async () => {
      useCartStore.setState({ items: [buildCartItem()] });
      (cartService.clearCart as jest.Mock).mockResolvedValue(undefined);

      await useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toEqual([]);
    });

    it("rethrows the error and stops loading on failure", async () => {
      (cartService.clearCart as jest.Mock).mockRejectedValue(new Error("boom"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(useCartStore.getState().clearCart()).rejects.toThrow("boom");
      expect(useCartStore.getState().isLoading).toBe(false);

      consoleSpy.mockRestore();
    });
  });
});
