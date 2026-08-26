import {CheckoutStepper} from "@/features/checkout/components/shared/CheckoutStepper";
import React from "react";

export default function CheckoutLoading() {
  return (
    <div className="page-max-width py-10 px-4 md:px-8 min-h-screen w-full animate-fade-in">
      <h1 className="text-font-5 font-bold text-black mb-8">Check Out</h1>

      {/* Stepper (Static visual representation for step 1) */}
      <CheckoutStepper activeStep={1} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Data Pengiriman Skeletons */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          {/* Address Section Skeleton */}
          <section className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="p-5 rounded-xl border-2 border-gray-100 bg-gray-50/50 space-y-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="pl-7 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 w-full max-w-md bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-3/4 max-w-sm bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="w-full h-12 bg-gray-100 rounded-full animate-pulse mt-2"></div>
          </section>

          {/* Shipping Options Skeleton */}
          <section className="space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-14 bg-gray-100 rounded-lg animate-pulse"></div>
          </section>

          {/* Notes Section Skeleton */}
          <section className="space-y-4">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          </section>
        </div>

        {/* RIGHT COLUMN: Order Summary Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            
            {/* Items Skeleton List */}
            <div className="p-5 space-y-5 border-b border-gray-100">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0 animate-pulse"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mt-2 self-end ml-auto animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Skeleton */}
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Grand Total Skeleton */}
            <div className="bg-gray-100 p-5 flex justify-between items-center">
              <div className="h-5 w-16 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Checkout Button Skeleton (Desktop) */}
          <div className="hidden lg:block mt-6">
            <div className="w-full h-14 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}