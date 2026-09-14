"use client";

import { MamaBearMascot } from "@/components/layout/chat/MamaBearMascot";
import {
  NEWSLETTER_CLOSED_EVENT,
  NEWSLETTER_STORAGE_KEY,
} from "@/features/home/hooks/useNewsletterPopup";
import { cn } from "@/lib/utils";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const GREETING_DELAY_MS = 2500;
const MAX_MESSAGE_LENGTH = 1000;

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const OPENING_MESSAGE: ChatMessage = {
  id: "opening",
  role: "assistant",
  content: "Hai Mama! Ada yang bisa MamaBear bantu hari ini?",
};

const MOCK_REPLIES = [
  "Siap, Mama. Ceritakan saja kebutuhan Mama seputar produk atau pesanan, ya.",
  "Terima kasih sudah menghubungi MamaBear. Tim kami akan bantu secepatnya.",
  "Baik, Mama. Ada lagi yang ingin ditanyakan?",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING_MESSAGE]);
  const listRef = useRef<HTMLDivElement>(null);
  const replyIndex = useRef(0);
  const remainingChars = MAX_MESSAGE_LENGTH - input.length;
  const canSend =
    input.trim().length > 0 &&
    input.length <= MAX_MESSAGE_LENGTH &&
    !isSending;

  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | undefined;

    const startGreeting = () => {
      delayTimer = setTimeout(() => setShowGreeting(true), GREETING_DELAY_MS);
    };

    const alreadyDismissed = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (alreadyDismissed) {
      startGreeting();
    } else {
      window.addEventListener(NEWSLETTER_CLOSED_EVENT, startGreeting);
    }

    return () => {
      window.removeEventListener(NEWSLETTER_CLOSED_EVENT, startGreeting);
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const openChat = () => {
    setIsOpen(true);
    setShowGreeting(false);
  };

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || text.length > MAX_MESSAGE_LENGTH || isSending) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    const reply = MOCK_REPLIES[replyIndex.current % MOCK_REPLIES.length];
    replyIndex.current += 1;

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: reply,
        },
      ]);
      setIsSending(false);
    }, 600);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[55] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {isOpen && (
        <section
          className="pointer-events-auto flex h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--mama-pink)] bg-white shadow-2xl"
          aria-label="Chat MamaBear"
        >
          <header className="flex items-center justify-between bg-[var(--mama-hot-pink)] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">MamaBear Care</p>
              <p className="text-[11px] text-white/85">Online • siap membantu</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 hover:bg-white/15"
              aria-label="Tutup chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[var(--mama-cream)]/50 px-3 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <p
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                    message.role === "user"
                      ? "rounded-br-md bg-[var(--mama-hot-pink)] text-white"
                      : "rounded-bl-md border border-[var(--mama-pink)] bg-white text-[var(--mama-brown)]",
                  )}
                >
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-[var(--mama-pink)] bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) =>
                  setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
                }
                onKeyDown={handleInputKeyDown}
                placeholder="Tulis pesan Mama..."
                maxLength={MAX_MESSAGE_LENGTH}
                rows={2}
                className="min-h-10 min-w-0 flex-1 resize-none rounded-2xl border border-[var(--mama-pink)] bg-[var(--mama-cream)]/40 px-3 py-2 text-sm text-[var(--mama-brown)] placeholder:text-[var(--color-light-gray)] focus:border-[var(--mama-hot-pink)] focus:outline-none"
                aria-label="Pesan chat"
                aria-describedby="chat-char-count"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--mama-hot-pink)] text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canSend}
                aria-label="Kirim pesan"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p
              id="chat-char-count"
              className={cn(
                "mt-1.5 text-right text-[11px] text-[var(--color-light-gray)]",
                remainingChars <= 50 && "text-[var(--mama-hot-pink)]",
              )}
            >
              Sisa {remainingChars} karakter
            </p>
          </form>
        </section>
      )}

      <div className="relative flex flex-col items-end">
        {showGreeting && !isOpen && (
          <div className="mama-bear-enter pointer-events-auto z-10 mb-[-1.35rem] flex flex-col items-end md:mb-[-1.75rem]">
            <div className="relative mb-1 mr-8 max-w-[11rem] md:mr-10 md:max-w-[13rem]">
              <button
                type="button"
                onClick={openChat}
                className="rounded-2xl rounded-br-sm border border-[var(--mama-pink)] bg-white px-3 py-2 text-left text-xs font-medium text-[var(--mama-brown)] shadow-lg md:text-sm"
              >
                Butuh bantuan, Mama?
              </button>
              <button
                type="button"
                onClick={() => setShowGreeting(false)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-white p-0.5 text-[var(--color-light-gray)] shadow"
                aria-label="Tutup sapaan"
              >
                <X className="h-3 w-3" />
              </button>
              <span className="pointer-events-none absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-b border-r border-[var(--mama-pink)] bg-white" />
            </div>
            <button
              type="button"
              onClick={openChat}
              className="h-[4.75rem] w-[4.25rem] md:h-24 md:w-[5.5rem]"
              aria-label="Buka chat MamaBear"
            >
              <MamaBearMascot className="h-full w-full" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : openChat())}
          className="pointer-events-auto group relative z-[1] flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mama-hot-pink)] text-white shadow-xl transition-transform hover:scale-110 md:h-14 md:w-14"
          aria-label={isOpen ? "Tutup chat" : "Buka chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6 md:h-7 md:w-7" />
          ) : (
            <MessageCircle className="h-6 w-6 group-hover:animate-bounce md:h-7 md:w-7" />
          )}
          {!isOpen && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mama-pink)] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--mama-pink)]" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
