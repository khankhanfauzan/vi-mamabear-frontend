"use client";

import { MamaBearMascot } from "@/components/layout/chat/MamaBearMascot";
import { ChatPanel } from "@/features/chat/components/ChatPanel";
import {
  NEWSLETTER_CLOSED_EVENT,
  NEWSLETTER_STORAGE_KEY,
} from "@/features/home/hooks/useNewsletterPopup";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const GREETING_DELAY_MS = 2500;

export default function ChatWidget() {
  const pathname = usePathname() || "";
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const hideOnChatPage = pathname === "/chat" || pathname.startsWith("/chat/");

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

  const openChat = () => {
    setIsOpen(true);
    setShowGreeting(false);
  };

  if (hideOnChatPage) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[55] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {isOpen && (
        <div className="pointer-events-auto">
          <ChatPanel
            variant="widget"
            historyEnabled={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
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
              <span className="pointer-events-none absolute -bottom-1.5 right-3 h-3 w-3 rotate-45 border-b border-r border-[var(--mama-pink)] bg-white" />
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
