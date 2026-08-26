"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Hero Banners Data
 * TODO: In production, these might come from an API or CMS.
 */
const BANNERS = [
  {
    id: 1,
    src: "/images/home/banner.webp",
    alt: "MamaBear Promo Utama",
  },
  {
    id: 2,
    src: "/images/home/banner-sale.webp",
    alt: "Kebaikan Nutrisi Mama",
  }
];

/**
 * HeroSection Component
 * A responsive, automatic sliding carousel for the homepage.
 * Responsive Heights: 200px (Mobile), 350px (SM), 500px (MD), 720px (LG), 85vh (2XL).
 */
export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  /**
   * Auto-slide logic: 5 second interval
   */
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[650px] 2xl:h-[70vh] overflow-hidden group">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Visible on Hover) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all opacity-50 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all opacity-50  group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6 md:w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Subtle Bottom Overlay for visual depth */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10" />
    </section>
  );
}
