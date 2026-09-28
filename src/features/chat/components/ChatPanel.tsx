"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, LockKeyhole, Send, X } from "lucide-react";
import Link from "next/link";
import { MAX_MESSAGE_LENGTH, useChatSession } from "../hooks/useChatSession";
import { ChatMessageList } from "./ChatMessageList";
import { ChatQuickReplies } from "./ChatQuickReplies";
import { AssistantTypingIndicator } from "@/features/ai/components/AssistantTypingIndicator";

type ChatPanelProps = {
  variant?: "widget" | "page";
  onClose?: () => void;
  historyEnabled?: boolean;
};

export function ChatPanel({
  variant = "widget",
  onClose,
  historyEnabled = true,
}: ChatPanelProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (!isLoggedIn) {
    return (
      <ChatAccessPanel
        variant={variant}
        onClose={onClose}
        isLoading={isLoading}
      />
    );
  }

  return (
    <AuthenticatedChatPanel
      variant={variant}
      onClose={onClose}
      historyEnabled={historyEnabled}
    />
  );
}

function panelClassName(isPage: boolean) {
  return cn(
    "flex flex-col overflow-hidden border border-[var(--mama-pink)] bg-white",
    isPage
      ? "h-[min(36rem,calc(100vh-12rem))] w-full rounded-2xl shadow-lg md:h-[min(40rem,calc(100vh-10rem))]"
      : "h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2rem))] rounded-2xl shadow-2xl",
  );
}

function ChatAccessPanel({
  variant,
  onClose,
  isLoading,
}: Pick<ChatPanelProps, "variant" | "onClose"> & { isLoading: boolean }) {
  return (
    <section
      className={panelClassName(variant === "page")}
      aria-label="Chat MamaBear"
    >
      <header className="flex items-center justify-between bg-[var(--mama-hot-pink)] px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">MamaBear Care</p>
          <p className="text-[11px] text-white/85">Online • siap membantu</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-white/15"
            aria-label="Tutup chat"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[var(--mama-cream)]/50 px-6 py-8 text-center">
        {isLoading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-[var(--mama-hot-pink)]" />
            <p className="text-sm text-[var(--mama-brown)]">
              Memeriksa sesi...
            </p>
          </>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--mama-pink)] text-[var(--mama-hot-pink)]">
              <LockKeyhole className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-[var(--mama-brown)]">
              Halo Ma! Yuk login atau daftar dulu untuk mulai berkonsultasi
              dengan Mama Bear AI.
            </p>
            <div className="flex w-full gap-3">
              <Link
                href="/login"
                className="flex-1 rounded-full bg-[var(--mama-hot-pink)] px-4 py-2 text-sm font-semibold text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-full border border-[var(--mama-hot-pink)] bg-white px-4 py-2 text-sm font-semibold text-[var(--mama-hot-pink)]"
              >
                Daftar
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function AuthenticatedChatPanel({
  variant = "widget",
  onClose,
  historyEnabled = true,
}: ChatPanelProps) {
  const {
    input,
    setInput,
    isSending,
    conversationId,
    usingHistory,
    messages,
    listRef,
    remainingChars,
    canSend,
    history,
    resetSession,
    sendMessage,
    handleInputKeyDown,
    sendQuickReply,
  } = useChatSession({ historyEnabled });

  const isPage = variant === "page";

  return (
    <section className={panelClassName(isPage)} aria-label="Chat MamaBear">
      <header className="flex items-center justify-between bg-[var(--mama-hot-pink)] px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">MamaBear Care</p>
          <p className="text-[11px] text-white/85">
            {usingHistory ? "Riwayat percakapan" : "Online • siap membantu"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {conversationId && (
            <Link
              href={`/chat/${conversationId}`}
              className="rounded-full px-2 py-1 text-[11px] font-medium text-white/90 hover:bg-white/15"
            >
              Lihat lengkap
            </Link>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-white/15"
              aria-label="Tutup chat"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto bg-[var(--mama-cream)]/50 px-3 py-4"
      >
        {usingHistory && history.isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--mama-brown)]">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--mama-hot-pink)]" />
            <p className="text-xs">Memuat riwayat...</p>
          </div>
        ) : usingHistory && history.error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-xs text-red-600">{history.error}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void history.refetch()}
                className="text-xs font-semibold text-[var(--mama-hot-pink)]"
              >
                Coba lagi
              </button>
              <span
                aria-hidden="true"
                className="text-xs text-[var(--color-gray)]"
              >
                •
              </span>
              <button
                type="button"
                onClick={resetSession}
                className="text-xs font-semibold text-[var(--mama-brown)] hover:underline"
              >
                Mulai baru
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-[var(--color-gray)]">
            Belum ada pesan di percakapan ini.
          </p>
        ) : (
          <ChatMessageList messages={messages} />
        )}

        {/* Typing indicator: muncul saat AI sedang memproses balasan */}
        {isSending && <AssistantTypingIndicator className="pt-1" />}
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t border-[var(--mama-pink)] bg-white p-3"
      >
        <ChatQuickReplies
          disabled={isSending || (usingHistory && history.isLoading)}
          onSelect={sendQuickReply}
        />
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
  );
}
