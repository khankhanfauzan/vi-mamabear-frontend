import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; 
import {CheckoutConfirmationView} from "@/features/checkout/components/CheckoutConfirmationView";

export default async function SuccessPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect(`/login?callbackUrl=/checkout/success/${params.id}`);
  }

  // We can fetch order data here server-side if we wanted to display 
  // summary information, but for now we just show the success banner.

  return (
    <div className="page-max-width py-10 px-4 md:px-8 min-h-screen">
      <CheckoutConfirmationView orderId={params.id} />
    </div>
  );
}