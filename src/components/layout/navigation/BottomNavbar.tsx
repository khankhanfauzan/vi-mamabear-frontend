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

interface BottomNavProps {
  isLoggedIn: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function BottomNav({ isLoggedIn }: BottomNavProps) {
  const pathname = usePathname() || "";

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
          href="https://api.whatsapp.com/send/?phone=628888695757&text&type=phone_number&app_absent=0"
          className="flex flex-col items-center justify-center w-full h-full text-[var(--mama-brown)] hover:text-primary transition-colors"
          target="_blank"
        >
          <MessageCircleMore className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] mt-1 font-semibold">Chat</span>
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
