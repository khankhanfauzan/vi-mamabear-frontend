import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// Adjust the import path to your actual next-auth options configuration
import { authOptions } from "@/lib/auth";
import { getAddresses } from "@/features/address/services/addressService";
import { Address } from "@/features/address/types/address.types";
import {AddressList} from "@/features/address/components/listing/AddressList";

/**
 * Server Component for the Address List Page.
 * Fetches the user's addresses server-side using their session token.
 */
export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  // Secure the page: redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  let addresses: Address[] = [];
  try {
    const token = session.accessToken || "";
    addresses = await getAddresses(token);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
  }

  return (
    <div className="page-max-width py-12 px-4 md:px-8 min-h-screen">
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Daftar Alamat
        </h1>
        <p className="text-font-2 text-gray-500 mt-2">
          Kelola alamat pengiriman Anda.
        </p>
      </div>

      {/* Pass the server-fetched data to the Client Component */}
      <AddressList initialAddresses={addresses} />
    </div>
  );
}
