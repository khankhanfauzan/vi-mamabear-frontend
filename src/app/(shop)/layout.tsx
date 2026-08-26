import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense
        fallback={<div className="h-[74px] bg-[var(--mama-pink)] w-full"></div>}
      >
        <Navbar />
      </Suspense>

      {/* Pages like Home, Search, Product Detail render here */}
      <main className="page-max-width w-full min-h-screen">{children}</main>

      <Footer />
    </div>
  );
}
