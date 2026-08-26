import React from "react";
import { UserPlus } from "lucide-react";
import { CreateAdminForm } from "@/features/admin/users/components/new/CreateAdminForm";

export default function CreateAdminPage() {
  return (
    <main className="page-max-width py-8 px-4 md:px-6 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[--mama-brown] mb-1">
          <UserPlus size={24} />
          <h1 className="text-font-h3 font-bold">Tambah Admin Baru</h1>
        </div>
        <p className="text-gray-500 text-font-body">
          Buat akun admin baru dengan mengisi informasi detail di bawah ini.
        </p>
      </div>

      {/* Form Container */}
      <CreateAdminForm />
    </main>
  );
}
