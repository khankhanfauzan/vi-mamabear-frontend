import { useCallback, useEffect, useState } from "react";
import { chatService } from "../services/chatService";
import type { ChatMessage } from "../types/chat.types";

export function useConversationHistory(
  conversationId: string | null,
  options: { enabled?: boolean } = {},
) {
  const enabled = options.enabled ?? true;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!conversationId || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const history = await chatService.getConversationHistory(conversationId);
      setMessages(history.messages);
    } catch (err) {
      setMessages([]);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat riwayat percakapan.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, enabled]);

  useEffect(() => {
    if (!conversationId || !enabled) {
      setIsLoading(false);
      return;
    }

    void fetchHistory();
  }, [conversationId, enabled, fetchHistory]);

  return {
    messages,
    setMessages,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
