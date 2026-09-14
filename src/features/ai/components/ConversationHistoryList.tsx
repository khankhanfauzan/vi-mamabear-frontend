"use client";

import { MessageCircle, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiConversations } from "@/features/ai/hooks/useAiConversations";
import { AiConversation } from "@/features/ai/types/conversation.types";

export function ConversationHistoryList() {
  const { conversations, isLoading, isMock, error } = useAiConversations();

  if (isLoading) {
    return <ConversationHistorySkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="rounded-md">
        <TriangleAlert className="size-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-pink-100 bg-pink-50/50 px-4 py-6 text-center text-sm text-stone-500">
        Belum ada riwayat percakapan.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isMock && (
        <p className="text-xs text-stone-400">
          Menampilkan contoh riwayat sementara.
        </p>
      )}
      <ul className="space-y-2" aria-label="Riwayat percakapan AI">
        {conversations.map((conversation) => (
          <ConversationHistoryItem
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </ul>
    </div>
  );
}

function ConversationHistoryItem({
  conversation,
}: {
  conversation: AiConversation;
}) {
  const title =
    conversation.title || conversation.preview || "Percakapan AI MamaBear";
  const preview = conversation.preview || "Tidak ada pratinjau percakapan.";
  const dateLabel = formatConversationDate(
    conversation.updatedAt || conversation.createdAt,
  );

  return (
    <li className="rounded-md border border-pink-100 bg-white px-3 py-2 shadow-sm">
      <div className="flex min-w-0 gap-2">
        <MessageCircle className="mt-0.5 size-4 shrink-0 text-pink-500" />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold text-stone-800">
              {title}
            </p>
            {dateLabel && (
              <time className="shrink-0 text-xs text-stone-400">
                {dateLabel}
              </time>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">
            {preview}
          </p>
        </div>
      </div>
    </li>
  );
}

function ConversationHistorySkeleton() {
  return (
    <div className="space-y-2" aria-label="Memuat riwayat percakapan">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="rounded-md border border-pink-100 bg-white px-3 py-2"
        >
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function formatConversationDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}
