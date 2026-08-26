"use client";

import { AlertTriangle } from "lucide-react";
import { DashboardLowStockProduct } from "../types/dashboard";

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface LowStockListProps {
  products: DashboardLowStockProduct[];
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function LowStockList({ products }: LowStockListProps) {
  // Taking only top 4 for visual consistency with the design
  const displayProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="text-yellow-500" size={20} />
        <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
          Peringatan Stok Rendah
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {displayProducts.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-yellow-200 bg-[#fffdf5] p-4"
          >
            <div>
              <h4 className="text-font-2 font-semibold text-[var(--mama-brown)]">
                {item.product.name.split(" - ")[0]}{" "}
                {/* Truncating long names */}
              </h4>
              <p className="text-font-1 text-[var(--color-gray)]">
                Hanya tersisa {item.stock} (batas: 10)
              </p>
            </div>
            <div className="rounded bg-yellow-100 px-3 py-1 text-font-1 font-medium text-yellow-800">
              {item.stock} stok
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="p-4 text-center text-font-2 text-gray-500">
            Semua stok produk aman.
          </div>
        )}
      </div>
    </div>
  );
}
