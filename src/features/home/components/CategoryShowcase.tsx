import Image from "next/image";

const categories = [
  {
    name: "Almond Mix",
    image: "/images/home/catalog-almondmix.webp",
    slug: "almond-mix",
  },
  {
    name: "Asi Booster",
    image: "/images/home/catalog-asibooster.webp",
    slug: "asi-booster",
  },
  {
    name: "Kukis Series",
    image: "/images/home/catalog-cookies.webp",
    slug: "kukis-series",
  },
  {
    name: "Teh Pelancar Asi",
    image: "/images/home/catalog-teh.webp",
    slug: "teh-pelancar-asi",
  },
  { name: "ZoyaMix", image: "/images/home/catalog-zoya.webp", slug: "zoyamix" },
  {
    name: "Gift & Hampers",
    image: "/images/home/catalog-gift.webp",
    slug: "gift-hampers",
  },
  {
    name: "Mama Support",
    image: "/images/home/catalog-.webp",
    slug: "mama-support",
  },
  {
    name: "SALE",
    image: "/images/home/catalog-sale.webp",
    slug: "sale",
    isSale: true,
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-center text-font-4 md:text-font-5 font-bold text-[var(--mama-brown)] mb-8">
          Kategori Produk
        </h2>
        <div className="grid grid-cols-4 gap-4 md:w-2/3 mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28 mb-3 transition-transform group-hover:scale-105">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className={`text-font-1 md:text-font-2 text-center font-bold leading-tight
                  ${cat.isSale ? "text-red-500" : "text-[var(--mama-brown)]"}
                `}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
