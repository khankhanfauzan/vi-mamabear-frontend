"use client";

import { MamaBearMascot } from "@/components/layout/chat/MamaBearMascot";
import {
  NEWSLETTER_CLOSED_EVENT,
  NEWSLETTER_STORAGE_KEY,
} from "@/features/home/hooks/useNewsletterPopup";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const GREETING_DELAY_MS = 2500;

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
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING_MESSAGE]);
  const listRef = useRef<HTMLDivElement>(null);
  const replyIndex = useRef(0);

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
    if (!text) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

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
    }, 600);
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
            className="flex items-center gap-2 border-t border-[var(--mama-pink)] bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan Mama..."
              className="min-w-0 flex-1 rounded-full border border-[var(--mama-pink)] bg-[var(--mama-cream)]/40 px-3 py-2 text-sm text-[var(--mama-brown)] placeholder:text-[var(--color-light-gray)] focus:border-[var(--mama-hot-pink)] focus:outline-none"
              aria-label="Pesan chat"
            />
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mama-hot-pink)] text-white hover:brightness-95 disabled:opacity-50"
              disabled={!input.trim()}
              aria-label="Kirim pesan"
            >
              <Send className="h-4 w-4" />
            </button>
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
