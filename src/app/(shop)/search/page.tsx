import { Suspense } from "react";
import { Metadata } from "next";
import { SearchResults } from "@/features/products/components/search/SearchResults";

export const metadata: Metadata = {
  title: "Cari Produk | MamaBear",
  description: "Cari produk pelancar ASI MamaBear favorit Anda.",
};

export default function SearchPage() {
  return (
    <>
      <main className="page-spacing page-max-width py-8">
        {/* Suspense is strictly required by Next.js when using useSearchParams 
        to prevent the entire page from de-optimizing into client-side rendering.
      */}
        <Suspense
          fallback={
            <div className="w-full flex flex-col gap-6 animate-pulse mt-8">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                <div className="h-64 bg-[var(--mama-pink)]/30 rounded-xl"></div>
                <div className="h-64 bg-[var(--mama-pink)]/30 rounded-xl"></div>
                <div className="h-64 bg-[var(--mama-pink)]/30 rounded-xl"></div>
                <div className="h-64 bg-[var(--mama-pink)]/30 rounded-xl"></div>
              </div>
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </main>
    </>
  );
}
