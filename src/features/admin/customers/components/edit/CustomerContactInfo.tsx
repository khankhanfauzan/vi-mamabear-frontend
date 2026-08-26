"use client";

import React from "react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { CustomerDetail } from "@/features/admin/customers/types/customer.types";

interface CustomerContactInfoProps {
  customer: CustomerDetail;
}

export function CustomerContactInfo({ customer }: CustomerContactInfoProps) {
  const primaryAddress =
    customer.addresses.length > 0 ? customer.addresses[0] : null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex gap-3">
      <div className="mt-0.5 text-gray-400 shrink-0">{icon}</div>
      <div className="flex flex-col">
        <span className="text-font-1 text-gray-500">{label}</span>
        <span className="text-font-2 text-gray-900 mt-0.5">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
      <h2 className="text-font-4 font-bold text-[var(--mama-brown)] mb-6">
        Informasi Kontak
      </h2>
      <div className="flex flex-col gap-5">
        <InfoRow
          icon={<Mail className="w-5 h-5" />}
          label="Email"
          value={customer.email}
        />
        <InfoRow
          icon={<Phone className="w-5 h-5" />}
          label="No. Telepon"
          value={customer.phone || "-"}
        />
        <InfoRow
          icon={<MapPin className="w-5 h-5" />}
          label="Alamat Pengiriman Utama"
          value={
            primaryAddress
              ? primaryAddress.completeAddress
              : "Belum ada alamat terdaftar"
          }
        />
        <InfoRow
          icon={<Calendar className="w-5 h-5" />}
          label="Bergabung Sejak"
          value={formatDate(customer.registeredAt)}
        />
      </div>
    </div>
  );
}
