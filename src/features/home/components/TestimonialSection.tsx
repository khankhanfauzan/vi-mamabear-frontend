"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    name: "Giselle",
    rating: 5,
    comment:
      "Sudah minum dr sejak melahirkan, skrg sudah 7 bulan. bagus dan berkualitas banget. ASI lancar dan baby masih full ASI sampai skrg. Thank u MamaBear!",
    product: "MamaBear Asi Booster",
    productImage: "/images/home/catalog-almondmix.webp",
    productName: "Mama Bear Almond Mix mamabear as...",
    productPrice: "Rp 42.000",
    productOriginalPrice: "Rp 100.000",
  },
  {
    name: "Winter",
    rating: 5,
    comment:
      "Kukisnya enak banget! Anak-anak suka, dan aku juga suka. Selain itu, rasanya juga enak dan gak bikin eneg. Terima kasih MamaBear!",
    product: "Kukis Series MamaBear",
    productImage: "/images/home/catalog-cookies.webp",
    productName: "MamaBear Kukis Series",
    productPrice: "Rp 42.000",
    productOriginalPrice: "Rp 100.000",
  },
  {
    name: "Karina",
    rating: 5,
    comment:
      "Ga cuma enak, tapi juga bikin ASI makin lancar. Thank you MamaBear!",
    product: "Almond Mix MamaBear",
    productImage: "/images/home/catalog-almondmix.webp",
    productName: "MamaBear Almond Mix",
    productPrice: "Rp 42.000",
    productOriginalPrice: "Rp 100.000",
  },
];

export function TestimonialSection() {
  return (
    <section className="pt-12 bg-gradient-to-b from-secondary to-background md:bg-white">
      {/* bg-gradient-to-b from-background to-secondary  */}
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-2xl font-bold text-[var(--color-gray)] mb-1 drop-shadow-[0_1.5px_4px_rgba(255,255,255,1)]">
          What Mama Says About
        </h2>
        <h3 className="text-3xl font-bold text-primary drop-shadow-[0_1.5px_4px_rgba(255,255,255,1)]">
          MamaBear Products
        </h3>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="">
            {reviews.map((review, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col md:flex-row items-center gap-6 px-2">
                  {/* left col - product card (mock) */}
                  <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden min-h-[280px] flex items-center justify-center">
                    <Image
                      src={review.productImage}
                      alt={review.product}
                      width={350}
                      height={350}
                      className="object-contain"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-[rgba(255,255,255,0.8)] rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <div className="relative w-14 h-14 shrink-0">
                        <Image
                          src={review.productImage}
                          alt={review.product}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-font-2 md:text-font-3 text-[var(--mama-brown)] font-bold line-clamp-1">
                          {review.productName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.5rem] lg:text-font-1 font-bold">
                            Mulai Dari
                          </span>
                          <span className="text-sm font-semibold text-primary md:text-font-3">
                            {review.productPrice}
                          </span>
                          <span className="text-font-1 text-muted-foreground line-through">
                            {review.productOriginalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* right col — testimonial */}
                  <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-sm overflow-hidden flex text-left">
                    {/* LEFT: product image */}
                    <div className="relative w-20 md:w-32 self-stretch shrink-0 ml-3">
                      <Image
                        src={review.productImage}
                        alt={review.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* RIGHT: name, rating, comment */}
                    <div className="flex flex-col justify-center p-6 gap-3">
                      <div>
                        <p className="font-semibold text-stone-800">
                          {review.name}
                        </p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span
                              key={i}
                              className="text-[var(--mama-hot-pink)]"
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[var(--color-gray)] text-font-1 font-medium leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-center gap-4 mt-6">
            <CarouselPrevious className="bg-white/50 border-none text-[var(--color-gray)] h-12 w-12 left-0" />
            <CarouselNext className="bg-white/50 border-none text-[var(--color-gray)] h-12 w-12 right-0 " />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
