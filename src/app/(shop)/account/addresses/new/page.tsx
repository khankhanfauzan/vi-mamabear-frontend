import { AddressForm } from "@/features/address/components/new/CreateAddressForm";
import React from "react";

/**
 * Server Component for the Address Creation Page.
 * Handles the main layout and constraints, delegating interactive logic to AddressForm.
 */
export default function CreateAddressPage() {
  return (
    <div className="py-12 px-4 md:px-8">
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Tambah Alamat Baru
        </h1>
        <p className="text-font-2 text-gray-500 mt-2">
          Masukkan detil alamat pengiriman Anda di bawah ini.
        </p>
      </div>

      {/* Client Component handling the interactive form & API syncing */}
      <AddressForm />
    </div>
  );
}
