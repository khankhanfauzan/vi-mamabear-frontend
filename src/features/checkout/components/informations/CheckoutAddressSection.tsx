import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Address } from "@/features/address/types/address.types";

interface CheckoutAddressSectionProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
}

export function CheckoutAddressSection({
  addresses,
  selectedAddressId,
  onSelectAddress,
}: CheckoutAddressSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
        Dikirim ke
      </h2>

      <div className="space-y-4">
        {addresses.map((address) => {
          const isSelected = selectedAddressId === String(address.id);
          return (
            <div
              key={address.id}
              onClick={() => onSelectAddress(String(address.id))}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-colors relative bg-white ${
                isSelected
                  ? "border-[var(--mama-hot-pink)] bg-pink-50/10"
                  : "border-gray-200 hover:border-gray-300"
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
                  href={`/account/addresses`}
                  className="text-gray-400 hover:text-[var(--mama-brown)] text-sm font-medium"
                >
                  Ubah
                </Link>
              </div>
              <div className="pl-7 space-y-1">
                <p className="text-[var(--mama-brown)] font-bold text-font-1">
                  {address.phone}
                </p>
                <div className="text-gray-600 text-font-1 leading-relaxed mt-2">
                  <p>
                    {address.road}{" "}
                    {address.detail && `(${address.detail})`}
                  </p>
                  <p>
                    Kec. {address.districtName}, Kel.{" "}
                    {address.subdistrictName}
                  </p>
                  <p>
                    {address.cityName}, {address.provinceName}
                  </p>
                  <p>{address.postalCode}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/account/addresses/new"
        className="block w-full text-center bg-[var(--mama-pink)] hover:bg-[#f5b8c9] text-[var(--mama-brown)] font-bold py-3 px-4 rounded-full transition-colors text-font-2"
      >
        + Alamat baru
      </Link>
    </section>
  );
}