import React from "react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function AdminUserHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 text-[--mama-brown] mb-1">
          <ShieldCheck size={24} />
          <h1 className="text-font-h3 font-bold">Manajemen Admin</h1>
        </div>
        <p className="text-gray-500 text-font-body">
          Kelola akses, peran, dan status seluruh admin sistem.
        </p>
      </div>

      {/* Placeholder for future Create Admin Button */}
      <Link
        href="/admin/users/new"
        className="hidden md:flex px-4 py-2 bg-[--mama-hot-pink] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
      >
        + Tambah Admin
      </Link>
    </div>
  );
}
