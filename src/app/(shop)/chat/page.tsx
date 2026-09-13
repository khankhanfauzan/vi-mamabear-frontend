"use client";

import { ChatPanel } from "@/features/chat/components/ChatPanel";

export default function ChatIndexPage() {
  return (
    <div className="px-4 py-8 pb-28 sm:px-6 lg:px-8 md:pb-8">
      <div className="mb-6">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Online Chat
        </h1>
        <p className="mt-1 text-sm text-[var(--color-gray)]">
          Tanya MamaBear Care seputar produk, pesanan, atau kebutuhan Mama.
        </p>
      </div>

      <ChatPanel variant="page" historyEnabled />
    </div>
  );
}
