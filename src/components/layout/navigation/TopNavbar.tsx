"use client";

import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/store/use-ui-store";
import { Menu, ShoppingCart, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SearchBar } from "@/features/products/components/shared/SearchBar";
import { UserDropdown } from "./UserDropdown";
import { MiniCartDropdown } from "@/features/cart/components/MiniCartDropdown";
import { useEffect, useState, useRef } from "react";
import { useCartStore } from "@/features/cart/store/use-cart-store";

interface TopNavbarProps {
  isLoggedIn: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function TopNavbar({ isLoggedIn, user }: TopNavbarProps) {
  // UI Store Connections
  const {
    toggleSidebar,
    setCartIconRect,
    isFlying: isCartFlying,
  } = useUIStore();

  // Cart Store Connections
  const cartItems = useCartStore((state) => state.items);

  const [mounted, setMounted] = useState(false);
  const cartIconRef = useRef<HTMLAnchorElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = pathname !== "/";

  useEffect(() => {
    setMounted(true);

    // Function to update coordinates of the cart icon
    const updateCartCoords = () => {
      if (cartIconRef.current) {
        const rect = cartIconRef.current.getBoundingClientRect();
        setCartIconRect({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Update on mount, window resize, and scroll to ensure accuracy
    updateCartCoords();
    window.addEventListener("resize", updateCartCoords);
    window.addEventListener("scroll", updateCartCoords, { passive: true });

    return () => {
      window.removeEventListener("resize", updateCartCoords);
      window.removeEventListener("scroll", updateCartCoords);
    };
  }, [setCartIconRect]);

  const totalCartItems =
    cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--mama-pink)] shadow-sm py-3 transition-colors">
      <div className="mx-auto flex items-center gap-5 md:gap-4 justify-between page-max-width page-spacing">
        {/* Hamburger (Desktop only), Back Button & Logo */}
        <div className="flex items-center shrink-0 md:gap-2">
          {showBackButton && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Kembali"
              className="flex text-[var(--mama-brown)] hover:bg-white/40 p-2 -ml-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mama-hot-pink)] md:hidden"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Buka Menu"
            className="hidden md:flex text-[var(--mama-brown)] hover:bg-white/40 p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mama-hot-pink)]"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <Link
            href="/products"
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mama-hot-pink)] rounded-md"
            aria-label="Beranda MamaBear"
          >
            <Image
              src="/images/layout/logo.png"
              alt="Mamabear Logo"
              width={50}
              height={50}
              className="md:w-[70px] md:h-[70px] transition-transform hover:scale-105"
              priority
            />
          </Link>
        </div>

        {/* Search Bar Component - Now flex-1 to gracefully fill space */}
        <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
          <SearchBar />
        </div>
        <div className="flex-1 block sm:hidden">
          {/* Mobile search could go here, or handled inside SearchBar component */}
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Profile - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center gap-3">
            <UserDropdown isLoggedIn={isLoggedIn} user={user} />
          </div>

          {/* Cart - Always visible (Wrapped for Desktop Hover) */}
          <div
            className="relative flex items-center h-full"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current)
                clearTimeout(hoverTimeoutRef.current);
              setIsMiniCartOpen(true);
            }}
            onMouseLeave={() => {
              hoverTimeoutRef.current = setTimeout(() => {
                setIsMiniCartOpen(false);
              }, 200); // 200ms grace period prevents accidental closures
            }}
          >
            <Link
              href="/cart"
              ref={cartIconRef}
              className={`text-[var(--mama-brown)] hover:bg-white/40 p-2 rounded-md transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mama-hot-pink)] group ${isCartFlying ? "animate-bounce" : ""}`}
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-7 h-7 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
              {mounted && totalCartItems > 0 && (
                <Badge
                  className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive hover:bg-destructive text-destructive-foreground border-2 border-[var(--mama-pink)] transition-transform duration-300 ${isCartFlying ? "scale-125" : "scale-100"}`}
                >
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </Badge>
              )}
            </Link>

            {/* Desktop Mini Cart Dropdown */}
            {mounted && isMiniCartOpen && (
              <div className="hidden md:block absolute top-full right-0 pt-4 z-[100]">
                <MiniCartDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
