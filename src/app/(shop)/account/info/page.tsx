import React from "react";
import { Metadata } from "next";
import { AccountInformation } from "@/features/account/components/AccountInformation";

export const metadata: Metadata = {
  title: "Informasi Akun | MamaBear",
  description: "Kelola informasi akun MamaBear Anda.",
};

export default function AccountInfoPage() {
  return <AccountInformation />;
}