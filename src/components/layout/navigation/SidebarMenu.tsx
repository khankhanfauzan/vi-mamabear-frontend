import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";

export function SidebarMenu() {
  const { isSidebarOpen, closeSidebar } = useUIStore();

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeSidebar}
      />

      {/* Menu Content */}
      <aside className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={closeSidebar}
              className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-full text-stone-600 hover:bg-stone-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Logo & Slogan Section */}
          <div className="flex items-center gap-3 mb-10 pl-2">
            <Image
              src="/images/layout/logo.png"
              alt="MB"
              width={80}
              height={80}
            />
            <span className="text-pink-500 font-bold text-lg">#kASIhMama</span>
          </div>

          {/* Menu Sections */}
          <div className="space-y-8 pl-2">
            {/* Produk Section */}
            <section>
              <h3 className="text-xl font-bold text-[var(--mama-brown)] mb-4">
                Produk
              </h3>
              <ul className="space-y-4 text-stone-600 font-medium">
                <li>
                  <Link href="/" onClick={closeSidebar}>
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/products" onClick={closeSidebar}>
                    Semua Produk
                  </Link>
                </li>
                <li>
                  <Link href="/products/almond-mix" onClick={closeSidebar}>
                    Almond Mix
                  </Link>
                </li>
                <li>
                  <Link href="/products/asi-booster" onClick={closeSidebar}>
                    Asi Booster
                  </Link>
                </li>
                <li>
                  <Link href="/products/kukis-series" onClick={closeSidebar}>
                    Kukis Series
                  </Link>
                </li>
                <li>
                  <Link href="/products/teh-asi" onClick={closeSidebar}>
                    Teh Pelancar Asi
                  </Link>
                </li>
                <li>
                  <Link href="/products/zoyamix" onClick={closeSidebar}>
                    ZoyaMix
                  </Link>
                </li>
                <li>
                  <Link href="/products/gift-hampers" onClick={closeSidebar}>
                    Gift & Hampers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sale"
                    onClick={closeSidebar}
                    className="text-red-500 font-bold"
                  >
                    SALE
                  </Link>
                </li>
              </ul>
            </section>

            <div className="border-t border-stone-200 w-full" />

            {/* Kontak Section */}
            <section>
              <h3 className="text-xl font-bold text-[var(--mama-brown)] mb-4">
                Kontak
              </h3>
              <ul className="space-y-4 text-stone-600 font-medium">
                <li>
                  <Link href="/chat" onClick={closeSidebar}>
                    Online Chat
                  </Link>
                </li>
                <li>
                  <Link href="/consultation" onClick={closeSidebar}>
                    Konsultasi Dengan Konselor Asi
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
