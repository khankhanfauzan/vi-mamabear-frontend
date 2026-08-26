"use client";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse h-full">
      {/* Image Skeleton */}
      <div className="aspect-square w-full bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="flex flex-col p-4 gap-3 flex-1">
        {/* Rating / Sold skeleton */}
        <div className="w-24 h-3 bg-gray-200 rounded"></div>
        
        {/* Title skeleton (2 lines) */}
        <div className="space-y-2 mb-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="mt-auto space-y-2 pt-2">
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
          <div className="w-32 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}