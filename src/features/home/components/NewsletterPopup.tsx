"use client";

import { useState } from "react";
import { useNewsletterPopup } from "@/features/home/hooks/useNewsletterPopup";
import Image from "next/image";

export default function NewsletterPopup() {
  const { isOpen, dismiss, onSubscribe } = useNewsletterPopup();
  const [email, setEmail] = useState("");
  const [name] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send name and email to backend
    console.log({ name, email });
    onSubscribe();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row 
                    shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} // prevent click from propagating to backdrop
      >
        <div className="hidden md:block md:w-5/12 relative min-h-[400px]">
          <Image
            src="/images/home/product-asibooster.webp"
            alt="Newsletter"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <button
            className="absolute top-3 right-3 w-5 h-5 bg-gray-100 rounded-full 
                            flex items-center justify-center text-[var(--color-light-gray)] hover:text-[var(--color-gray)]
                            hover:bg-gstone-100 transition-colors text-[10px] hover:scale-110"
            aria-label="Close"
            onClick={dismiss}
          >
            x
          </button>
          <div className="flex items-center justify-center mb-4 gap-3">
            <Image
              src="/images/layout/logo.png"
              alt="MamaBear Logo"
              width={60}
              height={40}
            />
            <p className="text-font-2 md:text-font-3 font-semibold text-[var(--mama-brown)]">
              Jangan lewatkan info terbaru
            </p>
          </div>
          <p className="text-[10px] md:text-font-1 text-[var(--mama-hot-pink)] font-semibold mb-2">
            Dapatkan promo spesial dan tips menarik seputar ibu dan anak,
            langsung ke email kamu setiap minggu.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="masukkan email Mama (contoh: mama@email.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-2.5 bg-transparent border-b border-[var(--color-light-gray)]
                                text-sm text-stone-800 placeholder:text-stone-300 placeholder:text-[10px]
                                focus:outline-none focus:border-[var(--mama-hot-pink)] transition-colors"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--mama-hot-pink)] text-white hover:text-white rounded-2xl text-[10px] 
                                md:text-font-1 font-medium tracking-wide hover:bg-pinl-600 transition-colors mt-1"
            >
              Daftarkan email
            </button>
          </form>
          <p className="text-font-1 text-[var(--mama-hot-pink)] text-center justify-center mt-2   ">
            #kASIhMama
          </p>
        </div>
      </div>
    </div>
  );
}
