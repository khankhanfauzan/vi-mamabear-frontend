"use client";

import { MessageCircle, X } from "lucide-react";
import React, { useState } from "react";
import { AssistantTypingIndicator } from "@/features/ai/components/AssistantTypingIndicator";
import { ConversationHistoryList } from "@/features/ai/components/ConversationHistoryList";

interface ChatWidgetProps {
  isAiResponding?: boolean;
}

export default function ChatWidget({ isAiResponding = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      {isOpen && (
        <section
          className="mb-4 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-pink-100 bg-white shadow-xl"
          aria-label="Chat AI MamaBear"
        >
          <div className="flex items-center justify-between border-b border-pink-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Chat AI MamaBear
              </h2>
              <p className="text-xs text-stone-500">Riwayat percakapan</p>
            </div>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-pink-50 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chat AI"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[min(420px,calc(100vh-7rem))] space-y-4 overflow-y-auto p-4">
            <ConversationHistoryList />
            {isAiResponding && (
              <AssistantTypingIndicator className="border-t border-pink-50 pt-3" />
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-xl transition-all hover:scale-110 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 group"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Tutup chat AI" : "Buka chat AI"}
        aria-expanded={isOpen}
      >
        <MessageCircle className="h-7 w-7 group-hover:animate-bounce" />
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-pink-300" />
        </span>
      </button>
    </div>
  );
}
