"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const items = [
  {
    src: "/images/home/icon-chat.webp",
    alt: "Chat Icon",
    title: "24/7 FREE KONSULTING \ndengan konselor laktasi",
  },
  {
    src: "/images/home/icon-brandchoice.webp",
    alt: "Brand Choice Icon",
    title: "BRAND CHOICE \n2021-2024",
  },
  {
    src: "/images/home/icon-natural.webp",
    alt: "Natural Icon",
    title: "NATURAL \n100% natural & halal",
  },
  {
    src: "/images/home/icon-mama.webp",
    alt: "Trusted Icon",
    title: "DIPERCAYA \nlebih dari 10jt mama",
  },
];

const slides = [items.slice(0, 2), items.slice(2, 4)];

export function USPBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Helper function to render text with line breaks (\n)
   */
  // TODO: move this in utils
  function renderTitle(title: string) {
    return title.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < title.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  }

  return (
    <div className="bg-white pt-4 pb-2 md:py-6 drop-shadow-[0_0px_5px_rgba(214,85,126,0.5)] z-[5]">
      {/* DESKTOP - all item flex */}
      <div className="hidden lg:flex max-w-5xl mx-auto px-4 items-center justify-center divide-x divide-gray-200">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 first:pl-0 last:pr-0 h-10"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={60}
              height={60}
              className="flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xs md:text-font-1 font-bold text-stone-700 leading-tight">
                {renderTitle(item.title)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE - carousel 2 item per slide */}
      <div className="lg:hidden w-full overflow-hidden flex flex-col">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="min-w-full flex items-center justify-center"
            >
              <div className="flex items-center justify-center gap-0 divide-x divide-gray-200">
                {slide.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex items-center gap-0 px-6`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={40}
                      height={40}
                      className="flex-shrink-0"
                    />
                    <span className="text-[10px] md:text-font-1 font-semibold text-stone-700 leading-tight">
                      {renderTitle(item.title)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* dot indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === current ? "bg-pink-400" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
