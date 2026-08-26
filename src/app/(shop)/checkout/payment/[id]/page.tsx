import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { CheckoutPaymentView } from "@/features/checkout/components/CheckoutPaymentView";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { payUrl?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect(`/login?callbackUrl=/checkout/payment/${params.id}`);
  }

  // searchParams.payUrl will be passed from step 1, or can be fetched from DB
  // if user revisits this page later
  const paymentUrl = searchParams.payUrl || null;

  return (
    <div className="page-max-width py-10 px-4 md:px-8 min-h-screen">
      <CheckoutPaymentView orderId={params.id} initialPaymentUrl={paymentUrl} />
    </div>
  );
}
