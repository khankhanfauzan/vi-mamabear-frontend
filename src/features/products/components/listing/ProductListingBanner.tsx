import React from "react";
import Image from "next/image";

export default function ProductListingBanner() {
  return (
    <div className="relative w-full h-[100px] sm:h-[150px] md:h-[200px] lg:h-[280px] bg-[var(--mama-pink)] overflow-hidden mb-4 border-b border-pink-100">
      <Image
        src="/images/products/product-listing-banner.webp"
        alt="Katalog Produk MamaBear"
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  );
}
