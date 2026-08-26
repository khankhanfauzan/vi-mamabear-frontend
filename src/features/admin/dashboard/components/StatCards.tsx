"use client";

import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { DashboardData } from "../types/dashboard";

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface StatCardsProps {
  data: DashboardData;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function StatCards({ data }: StatCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const cards = [
    {
      title: "Total Penjualan",
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      iconBg: "bg-[var(--mama-hot-pink)]",
    },
    {
      title: "Pesanan",
      value: formatNumber(data.getOrderCount),
      icon: ShoppingCart,
      iconBg: "bg-[var(--mama-brown)]",
    },
    {
      title: "Pelanggan",
      value: formatNumber(data.getCustomerCount),
      icon: Users,
      iconBg: "bg-[var(--mama-pink)]",
    },
    {
      title: "Produk",
      value: formatNumber(data.getProductCount),
      icon: Package,
      iconBg: "bg-[var(--mama-brown)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="flex flex-col justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm min-h-[120px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-font-2 text-[var(--color-gray)]">{card.title}</p>
                <h3 className="mt-2 text-font-4 font-bold text-[var(--mama-brown)] md:text-font-5">
                  {card.value}
                </h3>
              </div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${card.iconBg}`}
              >
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}