"use client";

export function CategorySkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden md:block w-48 lg:w-64 flex-shrink-0">
        <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-24 mb-6 mt-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1">
        <div className="h-10 bg-gray-200 rounded w-32 mb-10"></div>

        {/* Section 1 */}
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-px bg-gray-200 w-full mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {[1, 2].map((i) => (
            <div key={`skel-1-${i}`} className="flex items-center gap-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="h-5 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Section 2 */}
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-px bg-gray-200 w-full mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={`skel-2-${i}`} className="flex items-center gap-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="h-5 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
