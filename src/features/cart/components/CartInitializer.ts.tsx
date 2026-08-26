"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/features/cart/store/use-cart-store";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function CartInitializer() {
  const { isLoggedIn } = useAuth();
  const mergeGuestCart = useCartStore((state) => state.mergeGuestCart);
  const initializeCart = useCartStore((state) => state.initializeCart);

  const hasInitialized = useRef(false);
  const hasMerged = useRef(false);

  useEffect(() => {
    // 1. Unconditionally fetch cart on initial load (Guest or User)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeCart();
    }

    // 2. If they transition to authenticated, trigger the backend merge
    if (isLoggedIn && !hasMerged.current) {
      hasMerged.current = true;

      // Wrap in an async function so we can await the merge before fetching
      const performMergeAndFetch = async () => {
        await mergeGuestCart(); // Wait for backend to finish merging and clearing cookie
        await initializeCart(); // THEN fetch the shiny new complete cart
      };

      performMergeAndFetch();
    }

    // 3. Reset logic on logout
    if (!isLoggedIn) {
      hasMerged.current = false;
      // Re-initialize to fetch the new empty/guest cart state
      initializeCart();
    }
  }, [isLoggedIn, mergeGuestCart, initializeCart]);

  return null;
}
