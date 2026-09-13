import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types/chat.types";

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

export function ChatMessageList({
  messages,
  showTimestamps = false,
}: ChatMessageListProps) {
  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const timestamp = showTimestamps ? formatTimestamp(message.createdAt) : null;
        const isUser = message.role === "user";

        return (
          <div
            key={message.id}
            className={cn("flex", isUser ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                isUser
                  ? "rounded-br-md bg-[var(--mama-hot-pink)] text-white"
                  : "rounded-bl-md border border-[var(--mama-pink)] bg-white text-[var(--mama-brown)]",
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
