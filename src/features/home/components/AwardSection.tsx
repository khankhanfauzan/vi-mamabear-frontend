import Image from "next/image";

export function AwardsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-font-3 md:text-font-5 font-bold text-[var(--mama-brown)] mb-2">
          Penghargaan Kami
        </h2>
        <p className="text-font-2 md:text-font-3 font-medium text-[var(--color-light-gray)] mb-8">
          Produk kami telah memperoleh banyak penghargaan & terpercaya
        </p>
        <div className="flex flex-wrap justify-center items-center gap-1 md:gap-6">
          <Image src="/images/home/rewards-halal.webp" alt="halal" width={120} height={60} className="w-[60px] md:w-[120px] h-auto" />
          <Image src="/images/home/rewards-bpom.webp" alt="bpom" width={120} height={60} className="w-[60px] md:w-[120px] h-auto" />
          <Image src="/images/home/rewards-brandchoice.webp" alt="brandchoice" width={120} height={60} className="w-[60px] md:w-[120px] h-auto" />
          <Image src="/images/home/rewards-brandchoice2.webp" alt="brandchoice2" width={120} height={60} className="w-[60px] md:w-[120px] h-auto" />
          <Image src="/images/home/rewards-brandchoice3.webp" alt="brandchoice3" width={120} height={60} className="w-[60px] md:w-[120px] h-auto" />
        </div>
      </div>
    </section>
  );
}
