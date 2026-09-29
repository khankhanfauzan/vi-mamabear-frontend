"use client";

import { MessageCircle } from "lucide-react";
import { normalizeToWaLink } from "../utils/detectWhatsAppNumber";

interface WhatsAppButtonProps {
  phoneNumber: string;
  label?: string;
}

export function WhatsAppButton({
  phoneNumber,
  label = "Chat via WhatsApp",
}: WhatsAppButtonProps) {
  const waLink = normalizeToWaLink(phoneNumber);

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1ebe5d]"
    >
      <MessageCircle size={16} />
      {label}
    </a>
  );
}
