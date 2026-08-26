import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // Adjust to your real auth config
import { CheckoutView } from "@/features/checkout/components/informations/CheckoutView";
import {getAddresses} from "@/features/address/services/addressService";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect("/login?callbackUrl=/checkout");
  }

  // Fetch saved user profiles securely server-side
  const addresses = await getAddresses(session.accessToken).catch(() => []);
  const userEmail = session.user?.email || "";

  return (
    <div className="page-max-width py-10 px-4 md:px-8 min-h-screen">
      <CheckoutView initialAddresses={addresses} userEmail={userEmail} />
    </div>
  );
}



