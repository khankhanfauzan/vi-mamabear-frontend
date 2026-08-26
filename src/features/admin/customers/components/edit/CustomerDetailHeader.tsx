"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { CustomerDetail } from "@/features/admin/customers/types/customer.types";

interface CustomerDetailHeaderProps {
  customer: CustomerDetail;
}

export function CustomerDetailHeader({ customer }: CustomerDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/customers')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D6557E] text-white font-bold text-font-4 shadow-sm">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-font-3 md:text-font-4 font-bold text-[var(--mama-brown)] leading-tight">
              {customer.name}
            </h1>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-font-1 font-medium ${
              !customer.isBlocked 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {!customer.isBlocked ? 'Aktif' : 'Diblokir'}
            </span>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => window.location.href = `mailto:${customer.email}`}
        className="flex items-center gap-2 px-4 py-2 text-font-2 font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-55 rounded-md transition-colors shadow-sm"
      >
        <Mail className="w-4 h-4" />
        Kirim Email
      </button>
    </div>
  );
}