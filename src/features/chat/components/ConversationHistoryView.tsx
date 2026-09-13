"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useConversationHistory } from "../hooks/useConversationHistory";
import { CONVERSATION_STORAGE_KEY } from "../types/chat.types";
import { ChatMessageList } from "./ChatMessageList";

type ConversationHistoryViewProps = {
  conversationId: string;
};

export function ConversationHistoryView({
  conversationId,
}: ConversationHistoryViewProps) {
  const { messages, isLoading, error, refetch } =
    useConversationHistory(conversationId);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(CONVERSATION_STORAGE_KEY, conversationId);
  }, [conversationId]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--mama-pink)] bg-[var(--mama-cream)]/40 py-16 text-[var(--mama-brown)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--mama-hot-pink)]" />
        <p className="text-sm">Memuat riwayat percakapan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="mb-2 text-font-4 font-bold text-red-700">
          Gagal memuat percakapan
        </h2>
        <p className="mb-4 max-w-md text-font-2 text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-full bg-[var(--mama-hot-pink)] px-5 py-2 text-sm font-semibold text-white hover:brightness-95"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--mama-pink)] bg-[var(--mama-cream)]/30 px-6 py-16 text-center text-[var(--mama-brown)]">
        <p className="font-semibold">Belum ada pesan</p>
        <p className="mt-1 text-sm text-[var(--color-gray)]">
          Riwayat percakapan ini masih kosong.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="max-h-[70vh] overflow-y-auto rounded-2xl border border-[var(--mama-pink)] bg-[var(--mama-cream)]/50 p-4 md:p-6"
    >
      <ChatMessageList messages={messages} showTimestamps />
    </div>
  );
}
