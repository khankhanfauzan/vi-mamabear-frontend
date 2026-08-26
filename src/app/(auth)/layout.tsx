import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Suspense
        fallback={<div className="h-[74px] bg-[var(--mama-pink)] w-full"></div>}
      >
        <Navbar />
      </Suspense>

      <main className="page-max-width w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 ">{children}</main>

      <Footer />
    </div>
  );
}
