"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  ReceiptText,
  User,
  MessageCircleMore,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  isLoggedIn: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function BottomNav({ isLoggedIn }: BottomNavProps) {
  const pathname = usePathname() || "";
  const isChatPage = pathname === "/chat" || pathname.startsWith("/chat/");

  // Check if the current route is exactly /products/[something]
  const isProductDetailPage = /^\/products\/[^\/]+$/.test(pathname);

  // Hide the global bottom nav entirely on product detail pages
  if (isProductDetailPage) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 shadow-[0_-1px_4px_rgba(214,85,126,0.5)] pb-safe">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className="flex flex-col items-center justify-center w-full h-full text-[var(--mama-brown)] hover:text-primary transition-colors"
        >
          <Home className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] mt-1 font-semibold">Beranda</span>
        </Link>

        <Link
          href="/products"
          className="flex flex-col items-center justify-center w-full h-full text-[var(--mama-brown)] hover:text-primary transition-colors"
        >
          <LayoutGrid className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] mt-1 font-semibold">Produk</span>
        </Link>

        <Link
          href="/chat"
          className={cn(
            "flex h-full w-full flex-col items-center justify-center transition-colors hover:text-primary",
            isChatPage
              ? "text-[var(--mama-hot-pink)]"
              : "text-[var(--mama-brown)]",
          )}
          aria-current={isChatPage ? "page" : undefined}
        >
          <MessageCircleMore className="h-6 w-6" strokeWidth={2.5} />
          <span className="mt-1 text-[10px] font-semibold">Chat</span>
        </Link>

        <Link
          href="/account/orders"
          className="flex flex-col items-center justify-center w-full h-full text-[var(--mama-brown)] hover:text-primary transition-colors"
        >
          <ReceiptText className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] mt-1 font-semibold">Transaksi</span>
        </Link>

        <Link
          href={isLoggedIn ? "/account" : "/login"}
          className="flex flex-col items-center justify-center w-full h-full text-[var(--mama-brown)] hover:text-primary transition-colors"
        >
          <User className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] mt-1 font-semibold">Profil</span>
        </Link>
      </div>
    </div>
  );
}
