import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminProductsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Produk
        </h1>
        <p className="text-[var(--color-gray)] text-font-2 mt-1">
          Kelola katalog produk Anda
        </p>
      </div>
      <Link
        href="/admin/products/new"
        className="bg-[var(--mama-hot-pink)] hover:opacity-90 text-white px-6 py-2.5 rounded-md font-semibold flex items-center gap-2 transition-opacity shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Tambah Produk
      </Link>
    </div>
  );
}
