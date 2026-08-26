import ChatWidget from "@/components/layout/ChatWidget";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { USPBanner } from "@/features/home/components/USPBanner";
import { AwardsSection } from "@/features/home/components/AwardSection";
import { CategoryShowcase } from "@/features/home/components/CategoryShowcase";
import { FeaturedProducts } from "@/features/home/components/FeaturedProducts";
import { HeroSection } from "@/features/home/components/HeroSection";
import NewsletterPopup from "@/features/home/components/NewsletterPopup";
import { RoadToSale } from "@/features/home/components/RoadToSale";
import { TestimonialSection } from "@/features/home/components/TestimonialSection";
import { productService } from "@/features/products/services/productsService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await productService.fetchFilteredProducts({ limit: 4 });
  const products = data?.data;

  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <RoadToSale />
        <section className="page-max-width">
          <CategoryShowcase />
          <FeaturedProducts products={products} />
          <USPBanner />
          <TestimonialSection />
          <AwardsSection />
        </section>
      </main>

      <Footer />

      <ChatWidget />
      <NewsletterPopup />
    </>
  );
}
