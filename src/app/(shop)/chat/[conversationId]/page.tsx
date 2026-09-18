import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConversationHistoryView } from "@/features/chat/components/ConversationHistoryView";

export const metadata = {
  title: "Riwayat Percakapan | MamaBear",
  description: "Lihat seluruh riwayat pesan percakapan MamaBear Care.",
};

interface PageProps {
  params: {
    conversationId: string;
  };
}

export default function ConversationDetailPage({ params }: PageProps) {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/chat"
        className="mb-6 inline-flex items-center gap-2 text-font-2 font-medium text-[var(--color-gray)] transition-colors hover:text-[var(--mama-brown)]"
      >
        <ArrowLeft className="h-5 w-5" />
        Kembali ke Chat
      </Link>

      <div className="mb-6">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Detail Percakapan
        </h1>
        <p className="mt-1 text-sm text-[var(--color-gray)]">
          ID: {params.conversationId}
        </p>
      </div>

      <ConversationHistoryView conversationId={params.conversationId} />
    </div>
  );
}
