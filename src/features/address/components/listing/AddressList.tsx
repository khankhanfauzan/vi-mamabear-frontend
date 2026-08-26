"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Address } from "@/features/address/types/address.types";

interface AddressListProps {
  initialAddresses: Address[];
}

export function AddressList({ initialAddresses }: AddressListProps) {
  const addresses = initialAddresses;
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    initialAddresses.length > 0 ? initialAddresses[0].id : null,
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl border border-gray-200 text-gray-500 text-font-2 flex flex-col items-center justify-center gap-4">
            <MapPin className="text-gray-300" size={48} />
            <p>Belum ada alamat tersimpan.</p>
          </div>
        ) : (
          addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;

            return (
              <div
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`p-6 rounded-xl border cursor-pointer transition-colors relative ${
                  isSelected
                    ? "border-[var(--mama-hot-pink)] bg-white shadow-sm"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[var(--mama-brown)]" size={20} />
                    <h3 className="font-bold text-[var(--mama-brown)] text-font-2">
                      {address.usedFor} {address.name}
                    </h3>
                  </div>
                  <Link
                    href={`/account/addresses/${address.id}/edit`}
                    className="text-gray-400 hover:text-orange-900 text-sm font-medium transition-colors"
                  >
                    Ubah
                  </Link>
                </div>

                <div className="pl-7 space-y-2">
                  <p className="text-[var(--mama-brown)] font-bold text-font-1">
                    {address.phone}
                  </p>
                  <div className="text-gray-600 text-font-1 leading-relaxed">
                    <p>{address.road}</p>
                    {address.detail && <p>({address.detail})</p>}
                    <p>
                      {address.districtName && `Kec. ${address.districtName}, `}
                      {address.subdistrictName &&
                        `Kel. ${address.subdistrictName}`}
                    </p>
                    <p>
                      {address.cityName && `${address.cityName}, `}
                      {address.provinceName}
                    </p>
                    <p>{address.postalCode}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Link
        href="addresses/new"
        className="block w-full text-center bg-[var(--mama-pink)] hover:bg-[#f5b8c9] text-[var(--mama-brown)] font-bold py-4 px-4 rounded-full transition-colors text-font-3"
      >
        + Alamat baru
      </Link>
    </div>
  );
}
