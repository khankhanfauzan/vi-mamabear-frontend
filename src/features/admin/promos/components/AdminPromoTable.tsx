import React from "react";
import Link from "next/link";
import { formatIDR } from "@/utils/formatters";
import { Promo } from "../types/promo.types";

interface AdminPromoTableProps {
  promos: Promo[];
  isLoading: boolean;
  onDelete: (promo: Promo) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function AdminPromoTable({ promos, isLoading, onDelete }: AdminPromoTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-12 bg-[var(--mama-pink)] opacity-50 w-full border-b" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full border-b flex items-center px-6 gap-4">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (promos.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <p className="text-[var(--mama-brown)] text-font-4 font-bold mb-2">
          Tidak ada promo ditemukan
        </p>
        <p className="text-[var(--color-gray)] text-font-2">
          Mulai buat promo baru untuk menarik pelanggan.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow border border-gray-100 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-[var(--mama-pink)] text-[var(--mama-brown)] text-font-1 md:text-font-2 font-bold border-b border-gray-200">
            <th className="p-4">Kode</th>
            <th className="p-4">Tipe</th>
            <th className="p-4">Nilai</th>
            <th className="p-4">Min. Belanja</th>
            <th className="p-4">Masa Berlaku</th>
            <th className="p-4 text-center">Kuota (Terpakai)</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-font-2 text-[var(--color-gray)]">
          {promos.map((promo) => (
            <tr key={promo.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4 font-bold text-[var(--mama-brown)]">
                {promo.code}
              </td>
              <td className="p-4 text-sm">
                {promo.discountType === 'FREE_SHIPPING' ? 'Gratis Ongkir' :
                  promo.discountType === 'PRODUCT_PERCENTAGE' ? 'Diskon %' : 'Diskon Rp'}
              </td>
              <td className="p-4 text-sm font-medium">
                {promo.discountType === 'PRODUCT_PERCENTAGE' ? `${promo.discountValue}%` : formatIDR(Number(promo.discountValue))}
              </td>
              <td className="p-4 text-sm">{formatIDR(Number(promo.minSpendIdr))}</td>
              <td className="p-4 text-sm">
                {formatDate(promo.startedAt)} - {formatDate(promo.expiresAt)}
              </td>
              <td className="p-4 text-sm text-center">
                {promo.usageLimit} ({promo.usageCount})
              </td>
              <td className="p-4 text-center">
                {promo.isActive ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Aktif</span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Tidak Aktif</span>
                )}
              </td>
              <td className="p-4 text-center space-x-2">
                <Link
                  href={`/admin/promos/${promo.id}/edit`}
                  className="inline-block px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(promo)}
                  className="inline-block px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
