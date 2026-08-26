import React from "react";

interface CheckoutStepperProps {
  activeStep: 1 | 2 | 3;
}

export function CheckoutStepper({ activeStep }: CheckoutStepperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10 mt-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting Lines */}
        <div className="absolute left-0 top-4 w-full h-[2px] bg-gray-200 z-0"></div>
        <div 
          className="absolute left-0 top-4 h-[2px] bg-[var(--mama-pink)] transition-all duration-300 z-0"
          style={{ width: activeStep === 1 ? "0%" : activeStep === 2 ? "50%" : "100%" }}
        ></div>

        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-font-3 border-2 transition-colors duration-300 ${
              activeStep >= 1 
                ? "bg-[var(--mama-pink)] border-[var(--mama-pink)] text-[var(--mama-brown)]" 
                : "bg-white border-gray-300 text-gray-400"
            }`}
          >
            1
          </div>
          <span 
            className={`text-font-1 font-bold whitespace-nowrap transition-colors duration-300 ${
              activeStep >= 1 ? "text-[var(--mama-brown)]" : "text-gray-400"
            }`}
          >
            Data Pengiriman
          </span>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-font-3 border-2 transition-colors duration-300 ${
              activeStep >= 2 
                ? "bg-[var(--mama-pink)] border-[var(--mama-pink)] text-[var(--mama-brown)]" 
                : "bg-white border-gray-300 text-gray-400"
            }`}
          >
            2
          </div>
          <span 
            className={`text-font-1 font-semibold whitespace-nowrap transition-colors duration-300 ${
              activeStep >= 2 ? "text-[var(--mama-brown)]" : "text-gray-400"
            }`}
          >
            Pembayaran
          </span>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-font-3 border-2 transition-colors duration-300 ${
              activeStep === 3 
                ? "bg-[var(--mama-hot-pink)] border-[var(--mama-hot-pink)] text-white" 
                : "bg-white border-gray-300 text-gray-400"
            }`}
          >
            3
          </div>
          <span 
            className={`text-font-1 font-semibold transition-colors duration-300 break-normal ${
              activeStep === 3 ? "text-[var(--mama-hot-pink)] font-bold" : "text-gray-400"
            }`}
          >
            Pesanan dikonfirmasi
          </span>
        </div>
      </div>
    </div>
  );
}