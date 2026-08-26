"use client";

import { Button } from "@/components/ui/button";
import CountdownTimer from "@/features/home/components/CountdownTimer";
import { useState } from "react";

export function RoadToSale() {
  const targetDate = new Date("2026-06-06T00:00:00+07:00");
  const [isFinished] = useState(false);

  if (isFinished) return null;

  return (
    <section className="bg-[--mama-cream] py-2 md:py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-between max-w-4xl gap-2 md:gap-4">
        <div className="text-center md:text-left">
          <h2 className="font-extrabold text-[var(--mama-brown)] text-font-3 md:text-font-5 stroke-1">
            ROAD TO 6.6 SALE
          </h2>
          <Button
            variant="link"
            className="text-destructive text-font-1 md:text-font-2 font-bold p-0 h-auto stroke-1 hover:no-underline"
            style={{ color: "#F21D04" }}
          >
            KLAIM VOUCHERNYA &gt;
          </Button>
        </div>
        <div className="hidden md:flex gap-4">
          <CountdownTimer targetDate={targetDate} />
        </div>
      </div>
    </section>
  );
}
