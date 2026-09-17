"use client";

import { cn } from "@/lib/utils";

export const CHAT_QUICK_REPLIES = [
  "Promo Bulan Ini",
  "Rekomendasi Pelancar ASI",
  "Camilan Bernutrisi",
  "Cek Status Pesanan",
] as const;

type ChatQuickRepliesProps = {
  disabled?: boolean;
  onSelect: (label: string) => void;
};

export function ChatQuickReplies({ disabled, onSelect }: ChatQuickRepliesProps) {
  return (
    <div className="-mx-3 mb-2">
      <div
        className="flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Quick replies"
      >
        {CHAT_QUICK_REPLIES.map((label) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(label)}
            className={cn(
              "shrink-0 rounded-full border border-[var(--mama-pink)] bg-[var(--mama-cream)] px-3 py-1.5 text-xs font-semibold text-[var(--mama-brown)] transition-colors",
              "hover:border-[var(--mama-hot-pink)] hover:bg-[var(--mama-pink)] hover:text-[var(--mama-hot-pink)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
