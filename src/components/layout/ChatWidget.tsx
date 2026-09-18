"use client";

import { MessageCircle, Send, X } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { AssistantTypingIndicator } from "@/features/ai/components/AssistantTypingIndicator";
import { sendAiChatMessage } from "@/features/ai/services/conversationService";
import { AiChatMessage } from "@/features/ai/types/conversation.types";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  isAiResponding?: boolean;
}

const CONVERSATION_ID_STORAGE_KEY = "mamabear_ai_conversation_id";

export default function ChatWidget({ isAiResponding = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isAssistantTyping = isAiResponding || isSending;

  useEffect(() => {
    const storedConversationId = sessionStorage.getItem(
      CONVERSATION_ID_STORAGE_KEY,
    );

    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isAssistantTyping, isOpen, messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      createChatMessage("user", trimmedMessage),
    ]);
    setMessageInput("");
    setIsSending(true);
    setError(null);

    try {
      const response = await sendAiChatMessage(
        trimmedMessage,
        conversationId || undefined,
      );

      setConversationId(response.conversationId);
      sessionStorage.setItem(
        CONVERSATION_ID_STORAGE_KEY,
        response.conversationId,
      );
      setMessages((currentMessages) => [
        ...currentMessages,
        createChatMessage("assistant", response.reply),
      ]);
    } catch (err) {
      console.error("[ChatWidget] send message failed:", err);
      setError("Pesan belum bisa dikirim. Coba lagi sebentar.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      {isOpen && (
        <section
          className="mb-4 flex h-[min(560px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col rounded-lg border border-pink-100 bg-white shadow-xl"
          aria-label="Chat AI MamaBear"
        >
          <div className="flex items-center justify-between border-b border-pink-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Chat AI MamaBear
              </h2>
              <p className="text-xs text-stone-500">
                {conversationId ? "Percakapan tersambung" : "Mulai percakapan"}
              </p>
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

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="rounded-md border border-dashed border-pink-100 bg-pink-50/50 px-4 py-6 text-center text-sm leading-6 text-stone-500">
                Tanyakan produk MamaBear atau kebutuhan mama hari ini.
              </div>
            )}

            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))}

            {isAssistantTyping && (
              <AssistantTypingIndicator className="pt-1" />
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <p
              className="border-t border-pink-50 px-4 py-2 text-xs text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}

          <form
            className="flex items-end gap-2 border-t border-pink-100 p-3"
            onSubmit={handleSubmit}
          >
            <label htmlFor="ai-chat-message" className="sr-only">
              Pesan untuk AI MamaBear
            </label>
            <textarea
              id="ai-chat-message"
              className="max-h-28 min-h-10 flex-1 resize-none rounded-md border border-pink-100 bg-white px-3 py-2 text-sm leading-5 text-stone-800 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-stone-50"
              placeholder="Tulis pesan..."
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              disabled={isSending}
              rows={1}
            />
            <button
              type="submit"
              className="inline-flex size-10 items-center justify-center rounded-md bg-pink-500 text-white transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:cursor-not-allowed disabled:bg-pink-200"
              disabled={!messageInput.trim() || isSending}
              aria-label="Kirim pesan"
            >
              <Send className="size-4" />
            </button>
          </form>
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

function ChatMessageBubble({ message }: { message: AiChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
      aria-label={isUser ? "Pesan Anda" : "Balasan AI MamaBear"}
    >
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-6",
          isUser
            ? "rounded-br-md bg-pink-500 text-white"
            : "rounded-bl-md bg-pink-50 text-stone-700",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function createChatMessage(
  role: AiChatMessage["role"],
  content: string,
): AiChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}
