import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cart } from "@/features/cart/types/cart.types";
import { Address } from "@/features/address/types/address.types";
import { createOrder } from "@/features/checkout/services/checkoutService";
import { ShippingOption } from "@/features/address/types/shipping.types";
import { calculateShippingCost } from "@/features/address/services/shippingService";
import { createPayment } from "@/features/checkout/services/paymentService";
import {
  fetchCart,
  updateCartItemCourier,
} from "@/features/cart/services/cartService";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { CreateOrderPayload } from "@/features/checkout/types/checkoutOrder.types";

export function useCheckout(initialAddresses: Address[], userEmail: string) {
  const router = useRouter();
  const initializeCart = useCartStore((state) => state.initializeCart);

  // Form & Data States
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.length > 0 ? String(initialAddresses[0].id) : null,
  );
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  // Derived Values
  const selectedAddress = initialAddresses.find(
    (a) => String(a.id) === selectedAddressId,
  );
  const subtotal =
    cart?.items?.reduce(
      (sum, item) => sum + parseInt(item.price as string) * item.quantity,
      0,
    ) || 0;
  const shippingCost = selectedShipping?.cost || 0;
  const tax = cart?.taxIdr || 0;
  const promoDiscount = 0;
  const grandTotal = subtotal + shippingCost + tax - promoDiscount;

  // Initial Load & Shipping Calculation Effects
  useEffect(() => {
    async function loadCart() {
      try {
        const cartData = await fetchCart();
        setCart(cartData);
      } catch (error) {
        console.error("Failed to load cart for checkout", error);
      } finally {
        setIsLoadingCart(false);
      }
    }
    loadCart();
  }, []);

  useEffect(() => {
    async function getShippingOptions() {
      if (!selectedAddress || !cart?.id || !cart?.items?.length) {
        setShippingOptions([]);
        setSelectedShipping(null);
        return;
      }
      setIsCalculatingShipping(true);
      try {
        const options = await calculateShippingCost({
          destination: selectedAddress.subdistrictId,
          priceSortDirection: "lowest",
        });
        setShippingOptions(options);

        if (options.length > 0) {
          const defaultOption = options[0];
          setSelectedShipping(defaultOption);
          try {
            const updatedCart = await updateCartItemCourier(cart.id, {
              shippingCostIdr: defaultOption.cost,
              courierName:
                defaultOption.name || defaultOption.code.toUpperCase(),
              courierCode: defaultOption.code,
              shippingMethod: defaultOption.service,
            });
            setCart((prev) =>
              prev ? { ...updatedCart, items: prev.items } : updatedCart,
            );
          } catch (updateError) {
            console.error("Failed to sync default courier", updateError);
          }
        }
      } catch (error) {
        console.error("Failed to calculate shipping", error);
        setShippingOptions([]);
      } finally {
        setIsCalculatingShipping(false);
      }
    }
    getShippingOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, cart?.id, cart?.items?.length]);

  // Handlers
  const handleSelectAddress = (id: string) => setSelectedAddressId(id);
  const handleNotesChange = (value: string) => setNotes(value);

  const handleSelectShipping = async (optionIndex: number) => {
    const selectedOption = shippingOptions[optionIndex];
    setSelectedShipping(selectedOption);
    if (cart && selectedOption) {
      try {
        const updatedCart = await updateCartItemCourier(cart.id, {
          shippingCostIdr: selectedOption.cost,
          courierName: selectedOption.name || selectedOption.code.toUpperCase(),
          courierCode: selectedOption.code,
          shippingMethod: selectedOption.service,
        });
        setCart({ ...updatedCart, items: cart.items });
      } catch (error) {
        console.error("Failed to update cart courier selection", error);
      }
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress || !selectedShipping || !cart) {
      setErrorMessage("Mohon lengkapi alamat dan opsi pengiriman.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Post Order Creation
      const payload: CreateOrderPayload = {
        cartId: cart.id,
        addressId: Number(selectedAddress.id), // Casted safely to integer (number)
        notes: notes,
      };

      const order = await createOrder(payload);

      // 2. Post Payment Session
      const paymentPayload = {
        orderId: order.id,
        subtotal: grandTotal,
        customerDetails: [
          {
            firstName: order.shippingAddress.name,
            email: userEmail,
            phone: order.shippingAddress.phone,
          },
        ],
      };

      const transaction = await createPayment(paymentPayload);

      // Refresh global cart store
      try {
        await initializeCart();
      } catch (cartSyncError) {
        console.error("Failed to sync cart", cartSyncError);
      }

      // 3. Navigate to Payment Page (Step 2) and pass the midtrans URL safely
      router.push(
        `/checkout/payment/${order.id}?payUrl=${encodeURIComponent(transaction.paymentRedirectUrl)}`,
      );
    } catch (error) {
      console.error("Checkout process failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses pesanan Anda.",
      );
      setIsSubmitting(false); // Only toggle false if failed. If success, keep true to avoid double clicks while redirecting
    }
  };

  return {
    addresses: initialAddresses,
    cart,
    isLoadingCart,
    selectedAddressId,
    shippingOptions,
    selectedShipping,
    isCalculatingShipping,
    isSubmitting,
    errorMessage,
    notes,
    totals: {
      subtotal,
      shippingCost,
      tax,
      promoDiscount,
      grandTotal,
    },
    actions: {
      handleSelectAddress,
      handleSelectShipping,
      handleNotesChange,
      handleCheckout,
    },
  };
}
