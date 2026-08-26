"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { ProductImage } from "@/features/products/types/product.types";

interface ProductGalleryProps {
  images: ProductImage[];
  mainImage: ProductImage | null;
  onImageSelect: (img: ProductImage) => void;
}

export const ProductGallery = ({
  images,
  mainImage,
  onImageSelect,
}: ProductGalleryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 120; // Roughly the width of one thumbnail + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <button
        onClick={() => setIsLightboxOpen(true)}
        className="block w-full aspect-square relative rounded-xl overflow-hidden bg-[var(--mama-cream)] border border-[var(--mama-pink)] cursor-zoom-in group"
        aria-label="Zoom in product image"
      >
        {mainImage && (
          <>
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.altText || "Product Image"}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Hover overlay indicator */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/80 p-3 rounded-full text-[var(--mama-brown)] shadow-lg backdrop-blur-sm">
                <ZoomIn size={24} />
              </div>
            </div>
          </>
        )}
      </button>

      {/* Thumbnails */}
      <div className="relative flex items-center group">
        {/* Left Arrow - Shows on hover or if there are many images */}
        {images.length > 4 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 z-10 p-1.5 bg-white/90 border border-gray-100 rounded-full shadow-md text-[var(--mama-brown)] hover:text-[var(--mama-hot-pink)] hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto py-1 scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => onImageSelect(img)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                mainImage?.id === img.id
                  ? "border-[var(--mama-hot-pink)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || "Thumbnail"}
                fill
                className="object-contain"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        {images.length > 4 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 z-10 p-1.5 bg-white/90 border border-gray-100 rounded-full shadow-md text-[var(--mama-brown)] hover:text-[var(--mama-hot-pink)] hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && mainImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[60]"
            aria-label="Close zoom"
          >
            <X size={32} />
          </button>

          {/* Zoomed Image Container */}
          <div
            className="relative w-full max-w-5xl h-full max-h-[85vh] bg-transparent"
            onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing modal
          >
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.altText || "Zoomed Product Image"}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
};
