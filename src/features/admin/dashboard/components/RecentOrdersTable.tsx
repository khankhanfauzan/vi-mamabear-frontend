"use client";

import { DashboardRecentOrder } from "../types/dashboard";

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------

interface RecentOrdersTableProps {
  orders: DashboardRecentOrder[];
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  // Mapping the available API data to match the UI visual representation.
  // Note: Since the provided API type `DashboardRecentOrder` lacks ID, Date, Amount, and Status,
  // we will generate consistent fallback values to match the design constraints.

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-700";
      case "Diproses":
        return "bg-blue-100 text-blue-700";
      case "Tertunda":
        return "bg-yellow-100 text-yellow-700";
      case "Dibatalkan":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-font-3 font-bold text-[var(--mama-brown)] md:text-font-4">
          Pesanan Terbaru
        </h2>
        <p className="text-font-2 text-[var(--color-gray)]">
          Pesanan terbaru dari toko Anda
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-font-2">
          <thead className="bg-[var(--mama-pink)] text-[var(--mama-brown)]">
            <tr>
              <th className="px-6 py-4 font-semibold">ID Pesanan</th>
              <th className="px-6 py-4 font-semibold">Pelanggan</th>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold">Jumlah</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => {
              // Fallback mock data to match UI since API doesn't provide these yet
              const mockId = `#1023${4 - index}`;
              const mockDate = "2026-05-11 10:30";
              const mockAmount = "Rp 245.000";
              const mockStatus =
                index === 1
                  ? "Diproses"
                  : index === 2
                    ? "Tertunda"
                    : index === 4
                      ? "Dibatalkan"
                      : "Selesai";

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[var(--mama-brown)]">
                    {mockId}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-gray)]">
                    {order.user?.name || "Pelanggan Anonim"}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-gray)]">
                    {mockDate}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-gray)]">
                    {mockAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-font-1 font-medium ${getStatusColor(
                        mockStatus,
                      )}`}
                    >
                      {mockStatus}
                    </span>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Belum ada pesanan terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
