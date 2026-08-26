"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareMore, Share2, ShoppingCart } from "lucide-react";

interface ProductBottomBarProps {
  onOpenCartModal: () => void;
  onOpenShareModal: () => void;
  phoneNumber?: string;
}

export function ProductBottomBar({
  onOpenCartModal,
  onOpenShareModal,
  phoneNumber = "628888695757",
}: ProductBottomBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe bg-white">
      {/* Chat / WhatsApp */}
      <Link
        href={`https://api.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`}
        target="_blank"
        className="w-[20%] bg-white flex items-center justify-center border-t border-stone-100 active:bg-stone-50 transition-colors"
        aria-label="Chat dengan Admin"
      >
        <MessageSquareMore
          className="w-6 h-6 text-[var(--mama-brown)]"
          strokeWidth={2.5}
        />
      </Link>

      {/* Share Button */}
      <button
        onClick={onOpenShareModal}
        className="w-[20%] bg-[var(--mama-pink)] flex items-center justify-center active:bg-pink-300 transition-colors border-t border-transparent"
        aria-label="Bagikan Produk"
      >
        <Share2 className="w-6 h-6 text-[var(--mama-brown)]" strokeWidth={2.5} />
      </button>

      {/* Add to Cart - Triggers shared layout modal */}
      <button
        onClick={onOpenCartModal}
        className="flex-1 bg-[var(--mama-hot-pink)] text-white flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
      >
        <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
        <span className="font-bold text-font-2 tracking-wide">
          Masukkan Keranjang
        </span>
      </button>
    </div>
  );
}