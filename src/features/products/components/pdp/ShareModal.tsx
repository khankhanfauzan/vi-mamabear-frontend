"use client";

import React, { useEffect, useState } from "react";
import { X, Link as LinkIcon, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {FacebookIcon, InstagramIcon} from "@/components/icons/SocialIcons";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const ShareModal = ({ isOpen, onClose, productName }: ShareModalProps) => {
  const [url, setUrl] = useState("");

  // Safely grab the current URL on the client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link berhasil disalin!");
    onClose();
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Lihat produk ini: ${productName} ${url}`
      )}`,
      "_blank"
    );
    onClose();
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
    onClose();
  };

  const handleInstagram = () => {
    // Web browsers can't directly launch the IG post composer with a pre-filled link.
    // The best UX is to copy the link and instruct the user.
    navigator.clipboard.writeText(url);
    toast.success("Link disalin! Silakan bagikan di Instagram Mama.");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 relative animate-in slide-in-from-bottom-1/2 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[var(--mama-hot-pink)] transition-colors rounded-full hover:bg-gray-100"
          aria-label="Tutup"
        >
          <X size={24} />
        </button>

        <h3 className="text-font-3 font-bold text-[var(--mama-brown)] mb-6 text-center mt-2">
          Bagikan Produk Ini
        </h3>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle size={28} />
            </div>
            <span className="text-font-1 text-[var(--color-gray)] font-medium">WhatsApp</span>
          </button>

          <button onClick={handleFacebook} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FacebookIcon className="w-6 h-6"/>
            </div>
            <span className="text-font-1 text-[var(--color-gray)] font-medium">Facebook</span>
          </button>

          <button onClick={handleInstagram} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <InstagramIcon className="w-6 h-6"/>
            </div>
            <span className="text-font-1 text-[var(--color-gray)] font-medium">Instagram</span>
          </button>

          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-gray-100 text-[var(--color-gray)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <LinkIcon size={28} />
            </div>
            <span className="text-font-1 text-[var(--color-gray)] font-medium">Salin Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};