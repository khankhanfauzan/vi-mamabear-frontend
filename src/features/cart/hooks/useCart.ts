import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { cartService } from "@/features/cart/services/cartService";
import { useAuth } from "@/features/auth/hooks/useAuth";

const FREE_SHIPPING_THRESHOLD = 500000;

export const useCartLogic = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const cart = useCartStore((state) => state.cart);
  const items = useCartStore((state) => state.items);
  const isLoading = useCartStore((state) => state.isLoading);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const applyPromoCodeStore = useCartStore((state) => state.applyPromoCode);
  const removePromoCodeStore = useCartStore((state) => state.removePromoCode);

  const selectedIds = useMemo(
    () => new Set((items || []).map((i) => i.id)),
    [items],
  );

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    try {
      await applyPromoCodeStore(promoCode);
      toast.success("Berhasil", {
        description: "Kode promo berhasil digunakan!",
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Gagal menggunakan kode promo";
      setPromoError(errMsg);
      toast.error("Gagal", {
        description: errMsg,
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = async () => {
    setIsApplyingPromo(true);
    try {
      await removePromoCodeStore();
      setPromoCode("");
      toast.success("Kode promo dihapus");
    } catch (error: unknown) {
      toast.error("Gagal menghapus promo", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
      toast.success("Produk dihapus dari keranjang");
    } catch {
      toast.error("Gagal menghapus produk");
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item && quantity > item.variant.stock) {
      toast.error(`Stok maksimum tercapai (Sisa: ${item.variant.stock})`);
      return;
    }
    try {
      await updateQuantity(itemId, quantity);
    } catch {
      toast.error("Gagal memperbarui jumlah produk");
    }
  };

  const handleRemoveSelected = async () => {
    if (!items || items.length === 0) return;

    try {
      await clearCart();
      toast.success("Keranjang berhasil dikosongkan");
    } catch {
      toast.error("Gagal mengosongkan keranjang");
    }
  };

  const handleCheckout = async () => {
    const itemsQuery = items.map((i) => i.id).join(",");
    const targetUrl = `/checkout?items=${itemsQuery}`;

    // 1. Immediately redirect guests to login BEFORE running any validation
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(targetUrl)}`);
      return;
    }

    // 2. Only run cart validation if the user is already authenticated
    setIsCheckingOut(true);
    try {
      const validation = await cartService.validateCart();

      if (!validation.valid) {
        toast.error("Perhatian", {
          description:
            "Ada perubahan stok pada produk. Memuat ulang keranjang...",
        });
        await useCartStore.getState().initializeCart();
        setIsCheckingOut(false);
        return;
      }

      router.push(targetUrl);
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Error", {
        description:
          "Terjadi kesalahan saat memvalidasi keranjang. Silakan coba lagi.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const { totalQuantity } = useMemo(() => {
    let totalQuantity = 0;
    const safeItems = items || [];

    safeItems.forEach((item) => {
      totalQuantity += item.quantity;
    });

    return { totalQuantity };
  }, [items]);

  const subtotal = cart?.subtotalIdr || 0;
  
  const appliedPromo = cart?.promoCodeString || null;
  const promoObj = cart?.promoCode || null;

  let productDiscount = cart?.productDiscountIdr || 0;
  const shippingDiscount = cart?.shippingDiscountIdr || 0;

  // Manual fallback calculation for cart page display if backend hasn't calculated it yet
  if (promoObj && productDiscount === 0) {
    if (promoObj.discountType === 'PRODUCT_PERCENTAGE') {
      const percentage = parseFloat(promoObj.discountValue) / 100;
      productDiscount = subtotal * percentage;
      if (promoObj.maxDiscountIdr && productDiscount > promoObj.maxDiscountIdr) {
        productDiscount = promoObj.maxDiscountIdr;
      }
    } else if (promoObj.discountType === 'PRODUCT_FIXED') {
      productDiscount = parseFloat(promoObj.discountValue);
    }
  }

  // Ensure discount does not exceed subtotal
  if (productDiscount > subtotal) {
    productDiscount = subtotal;
  }

  const grandTotal = subtotal - productDiscount - shippingDiscount;


  const missingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  return {
    cart,
    items: items || [],
    isLoading,
    isLoggedIn,
    selectedIds,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    handleRemoveSelected,
    handleCheckout,
    subtotal,
    totalQuantity,
    grandTotal,
    discountAmount: productDiscount + shippingDiscount,
    missingForFreeShipping,
    freeShippingProgress,
    promoCode,
    setPromoCode,
    appliedPromo,
    promoObj,
    handleApplyPromo,
    handleRemovePromo,
    isApplyingPromo,
    promoError,
    isCheckingOut,
  };
};
