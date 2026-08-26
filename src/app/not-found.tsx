import React, { Suspense } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <>
      {/* Wrapped in Suspense to prevent CSR bailout from SearchBar's useSearchParams */}
      <Suspense fallback={<header className="h-16 md:h-20 w-full bg-[var(--mama-pink)] shadow-sm" />}>
        <Navbar />
      </Suspense>

      <main className="page-max-width min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Icon Container */}
        <div className="w-24 h-24 bg-[var(--mama-cream)] text-[var(--mama-hot-pink)] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[var(--mama-pink)]">
          <SearchX size={48} strokeWidth={1.5} />
        </div>

        {/* Typography */}
        <h1 className="text-font-6 font-bold text-[var(--mama-brown)] mb-4">
          Oops, Halaman yang Mama cari belum ketemu :(
        </h1>
        <p className="text-font-2 text-[var(--color-gray)] max-w-xl mb-8 leading-relaxed">
          Maaf Ma, halaman yang Mama cari sepertinya tidak ada,
          atau link-nya mungkin salah.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="px-8 py-3 bg-[var(--mama-hot-pink)] text-white rounded-full font-bold hover:opacity-90 transition-opacity text-font-2 shadow-md"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-white text-[var(--mama-hot-pink)] border-2 border-[var(--mama-hot-pink)] rounded-full font-bold hover:bg-[var(--mama-pink)] transition-colors text-font-2"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}