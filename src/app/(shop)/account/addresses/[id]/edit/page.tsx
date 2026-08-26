import React from "react";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth"; // Adjust to your next-auth options configuration
import {getAddressById} from "@/features/address/services/addressService";
import {Address} from "@/features/address/types/address.types";
import {UpdateAddressForm} from "@/features/address/components/edit/UpdateAddressForm";

interface EditAddressPageProps {
  params: {
    id: string;
  };
}

/**
 * Server Component for the Edit/Update Address Page.
 * Fetches specific address detail secure server-side using route ID.
 */
export default async function EditAddressPage({
  params,
}: EditAddressPageProps) {
  const session = await getServerSession(authOptions);

  // Guard: Unauthorized access
  if (!session || !session.accessToken) {
    redirect(`/login?callbackUrl=/account/addresses/${params.id}`);
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  let address: Address | null = null;
  try {
    address = await getAddressById(id, session.accessToken);
  } catch (error) {
    console.error(`Gagal memuat alamat ID ${id} pada halaman server:`, error);
  }

  // Not Found fallback if ID was invalid or doesn't belong to the user
  if (!address) {
    notFound();
  }

  return (
    <main className="page-max-width py-12 px-4 md:px-8 min-h-screen">
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Ubah Alamat Pengiriman
        </h1>
        <p className="text-font-2 text-gray-500 mt-2">
          Ubah atau hapus detail data alamat pengiriman Anda.
        </p>
      </div>

      {/* Client Edit Form Container */}
      <UpdateAddressForm address={address} />
    </main>
  );
}
