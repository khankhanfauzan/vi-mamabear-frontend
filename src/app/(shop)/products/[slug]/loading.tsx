import React from "react";

/**
 * Product Detail Loading State
 * Automatically triggered by Next.js App Router when navigating to
 * /products/[slug] while the server component is fetching data.
 * This prevents the UI from feeling "stuck" on the previous page.
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse min-h-screen flex flex-col items-start justify-start w-full">
      {/* Back Button Skeleton */}
      <div className="w-24 h-10 bg-stone-100 rounded-md mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        {/* Gallery Section Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-pink-50/50 rounded-3xl w-full border border-pink-100/50" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-stone-100 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info Section Skeleton */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="w-24 h-6 bg-pink-100/50 rounded-full mb-3" />
            <div className="w-3/4 h-10 bg-stone-100 rounded-xl mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1/4 h-6 bg-stone-100 rounded-md" />
              <div className="w-1/4 h-6 bg-stone-100 rounded-md" />
            </div>
          </div>

          {/* Price Box Skeleton */}
          <div className="bg-secondary/30 p-6 rounded-2xl mb-8">
            <div className="w-1/2 h-10 bg-stone-100 rounded-xl" />
          </div>

          {/* Variants & Qty Skeleton */}
          <div className="space-y-6 mb-8">
            <div>
              <div className="w-24 h-4 bg-stone-100 rounded-md mb-2" />
              <div className="flex gap-2">
                <div className="w-20 h-10 bg-stone-100 rounded-full" />
                <div className="w-20 h-10 bg-stone-100 rounded-full" />
              </div>
            </div>

            <div>
              <div className="w-16 h-4 bg-stone-100 rounded-md mb-2" />
              <div className="w-32 h-10 bg-stone-100 rounded-full" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="h-14 bg-stone-100 rounded-2xl w-full" />
            <div className="h-14 bg-pink-100/50 rounded-2xl w-full" />
          </div>
        </div>
      </div>

      {/* Description Section Skeleton */}
      <div className="mt-16 border-t border-stone-100 pt-12 space-y-4 w-full">
        <div className="w-48 h-8 bg-stone-100 rounded-lg mb-6" />
        <div className="w-full h-4 bg-stone-100 rounded-sm" />
        <div className="w-full h-4 bg-stone-100 rounded-sm" />
        <div className="w-5/6 h-4 bg-stone-100 rounded-sm" />
        <div className="w-3/4 h-4 bg-stone-100 rounded-sm" />
      </div>
    </div>
  );
}