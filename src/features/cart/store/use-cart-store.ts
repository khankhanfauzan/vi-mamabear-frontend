import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ProductDetail,
  ProductVariant,
} from "@/features/products/types/product.types";
import { CartItem } from "@/features/cart/types/cart.types";
import { cartService } from "@/features/cart/services/cartService";

export interface AddItemPayload {
  product: ProductDetail;
  variant: ProductVariant | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;

  setIsOpen: (isOpen: boolean) => void;
  initializeCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  addItem: (payload: AddItemPayload) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      initializeCart: async () => {
        set({ isLoading: true });
        try {
          const dbCart = await cartService.fetchCart();
          if (dbCart) {
            set({ items: dbCart.items });
          } else {
            // If backend says no cart, we clear local cache to sync with backend
            set({ items: [] });
          }
        } catch (error) {
          console.error("[useCartStore] initializeCart failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      mergeGuestCart: async () => {
        set({ isLoading: true });
        try {
          // Tell the backend to merge the cookie session into the JWT user
          await cartService.mergeCart();
          // const mergedCart = await cartService.mergeCart();
          // if (mergedCart) {
          //   set({ items: mergedCart.items });
          // }
        } catch (error) {
          console.error("[useCartStore] mergeGuestCart failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (payload) => {
        const { product, variant, quantity } = payload;
        set({ isLoading: true });

        try {
          const dbItem = await cartService.addToCart({
            productId: product.id,
            variantId: variant?.id || 0,
            quantity,
          });

          const currentItems = get().items || [];
          const existingItemIndex = currentItems.findIndex(
            (i) =>
              i.productId === product.id && i.variantId === (variant?.id || 0),
          );

          const newItems = [...currentItems];
          if (existingItemIndex >= 0) {
            newItems[existingItemIndex].quantity = dbItem.quantity;
          } else {
            // Append with frontend data since backend response lacks nested product/variant
            newItems.push({
              ...dbItem,
              product: {
                id: product.id,
                name: product.name,
                isActive: true,
                images: product.images,
              },
              variant: variant
                ? {
                    id: variant.id,
                    name: variant.name || `Varian ${variant.id}`,
                    priceIdr: variant.priceIdr,
                    stock: variant.stock,
                    productId: product.id,
                    weightG: variant.weightG || 0,
                    images: variant.images,
                  }
                : {
                    id: 0,
                    name: "Default",
                    priceIdr: "0",
                    stock: 0,
                    productId: product.id,
                    weightG: 0,
                  },
            });
          }
          set({ items: newItems, isOpen: true });
        } catch (error) {
          console.error("[useCartStore] addItem failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          const dbItem = await cartService.updateCartItemQuantity(
            itemId,
            quantity,
          );
          const newItems = (get().items || []).map((item) =>
            item.id === itemId ? { ...item, quantity: dbItem.quantity } : item,
          );
          set({ items: newItems });
        } catch (error) {
          console.error("[useCartStore] updateQuantity failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true });
        try {
          await cartService.removeCartItem(itemId);
          const newItems = (get().items || []).filter(
            (item) => item.id !== itemId,
          );
          set({ items: newItems });
        } catch (error) {
          console.error("[useCartStore] removeItem failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await cartService.clearCart();
          set({ items: [] });
        } catch (error) {
          console.error("[useCartStore] clearCart failed:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "mamabear-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "mamabear-cart-storage") {
      useCartStore.persist.rehydrate();
    }
  });
}
