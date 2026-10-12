import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const DISCLAIMER_TEXT =
  "Informasi produk bersifat edukatif dan bukan pengganti saran medis profesional. Jika keluhan berlanjut, hubungi dokter atau CS kami via WhatsApp.";

type ChatProductDisclaimerProps = {
  className?: string;
};

export function ChatProductDisclaimer({
  className,
}: ChatProductDisclaimerProps) {
  return (
    <div
      role="note"
      aria-label="Penafian informasi produk"
      className={cn(
        "mt-2 flex items-start gap-1.5 rounded-xl border border-[var(--mama-pink)] bg-[var(--mama-cream)]/60 px-2.5 py-2 text-[11px] leading-relaxed text-[var(--color-gray)]",
        className,
      )}
    >
      <AlertTriangle
        aria-hidden="true"
        className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--mama-hot-pink)]"
      />
      <p className="min-w-0 break-words">
        <strong className="font-semibold text-[var(--mama-brown)]">
          Catatan:
        </strong>{" "}
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
