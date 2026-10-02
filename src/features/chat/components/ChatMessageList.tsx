"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "../types/chat.types";
import {
  extractWhatsAppNumbers,
  stripWhatsAppNumbers,
} from "../utils/detectWhatsAppNumber";
import { isClarificationResponse } from "../utils/chatResponseType";
import { ProductChatCard } from "./ProductChatCard";
import { WhatsAppButton } from "./WhatsAppButton";

function formatTimestamp(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

type ChatMessageListProps = {
  messages: ChatMessage[];
  showTimestamps?: boolean;
};

function AssistantMarkdown({ content }: { content: string }) {
  const numbers = extractWhatsAppNumbers(content);
  const markdownContent =
    numbers.length > 0 ? stripWhatsAppNumbers(content) : content;

  return (
    <>
      {markdownContent ? (
        <div className="chat-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      ) : null}
      {numbers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {numbers.map((num) => (
            <WhatsAppButton key={num} phoneNumber={num} />
          ))}
        </div>
      )}
    </>
  );
}

export function ChatMessageList({
  messages,
  showTimestamps = false,
}: ChatMessageListProps) {
  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const timestamp = showTimestamps ? formatTimestamp(message.createdAt) : null;
        const isUser = message.role === "user";
        const isClarification = !isUser && isClarificationResponse(message);
        const reply = message.content;

        return (
          <div
            key={message.id}
            className={cn("flex", isUser ? "justify-end" : "justify-start")}
          >
            <div className={cn("max-w-[85%]", !isUser && "w-full")}>
              <div
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                  isUser
                    ? "rounded-br-md bg-[var(--mama-hot-pink)] text-white"
                    : "rounded-bl-md border border-[var(--mama-pink)] bg-white text-[var(--mama-brown)]",
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{reply}</p>
                ) : (
                  <AssistantMarkdown content={reply} />
                )}
                {timestamp && (
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      isUser ? "text-white/80" : "text-[var(--color-light-gray)]",
                    )}
                  >
                    {timestamp}
                  </p>
                )}
                {isClarification && (
                  <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--mama-cream)] px-2 py-0.5 text-[10px] font-semibold text-[var(--mama-hot-pink)]">
                    MamaBear butuh info lebih
                  </p>
                )}
              </div>
              {!isUser &&
                !isClarification &&
                message.products &&
                message.products.length > 0 && (
                  <ProductChatCard data={message.products} />
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
