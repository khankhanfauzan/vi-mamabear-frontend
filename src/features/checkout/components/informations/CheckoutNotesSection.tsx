import React from "react";

interface CheckoutNotesSectionProps {
  notes: string;
  onNotesChange: (value: string) => void;
  disabled: boolean;
}

export function CheckoutNotesSection({
  notes,
  onNotesChange,
  disabled,
}: CheckoutNotesSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-font-3 font-bold text-black">
        Catatan Pesanan
      </h2>
      <textarea
        className="w-full border border-[var(--mama-hot-pink)] rounded-lg px-4 py-4 text-font-2 text-[var(--mama-brown)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] transition-all resize-y min-h-[100px] bg-white disabled:bg-gray-50 disabled:border-gray-300"
        placeholder="Tulis pesan untuk penjual (opsional)..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        disabled={disabled}
      />
    </section>
  );
}