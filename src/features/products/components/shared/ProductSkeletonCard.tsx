/**
 * -------------------------------------------------------------------------
 * SUB-COMPONENT: ProductSkeletonCard
 * -------------------------------------------------------------------------
 */
export default function ProductSkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-3xl p-4 border border-stone-100 h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-pink-50/50 rounded-2xl mb-4 w-full" />

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1">
        {/* Title Lines */}
        <div className="h-4 bg-stone-100 rounded-full w-full mb-2" />
        <div className="h-4 bg-stone-100 rounded-full w-2/3 mb-4" />

        {/* Rating/Sold Line */}
        <div className="h-3 bg-stone-100 rounded-full w-1/3 mb-4" />

        {/* Price & Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="h-6 bg-stone-200 rounded-full w-1/2" />
          <div className="w-10 h-10 rounded-full bg-pink-100/50" />
        </div>
      </div>
    </div>
  );
}