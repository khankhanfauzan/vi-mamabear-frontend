import React from "react";
import { formatIDR } from "@/utils/formatters";

export const FreeShippingBar = ({ 
  missingAmount, 
  progress 
}: { 
  missingAmount: number; 
  progress: number; 
}) => {
  return (
    <div className="w-full flex flex-col items-center mb-8 px-4 sm:px-0">
      <p className="text-font-2 font-medium text-[var(--mama-hot-pink)] mb-3">
        {missingAmount > 0 
          ? `Tambah ${formatIDR(missingAmount)} lagi, Mama dapat gratis ongkir` 
          : "Hore! Mama mendapatkan gratis ongkir"}
      </p>
      
      <div className="w-full max-w-2xl bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-[var(--mama-hot-pink)] h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};