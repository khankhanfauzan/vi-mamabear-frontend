import { useCallback, useEffect, useRef, useState } from "react";
import {
  chatService,
  ConversationNotFoundError,
} from "../services/chatService";
import type { ChatMessage } from "../types/chat.types";

type UseConversationHistoryOptions = {
  enabled?: boolean;
  onNotFound?: () => void;
};

export function useConversationHistory(
  conversationId: string | null,
  options: UseConversationHistoryOptions = {},
) {
  const enabled = options.enabled ?? true;
  const onNotFound = options.onNotFound;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onNotFoundRef = useRef(onNotFound);

  useEffect(() => {
    onNotFoundRef.current = onNotFound;
  });

  const fetchHistory = useCallback(async () => {
    if (!conversationId || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const history = await chatService.getConversationHistory(conversationId);
      setMessages(history.messages);
    } catch (err) {
      setMessages([]);

      if (err instanceof ConversationNotFoundError) {
        if (onNotFoundRef.current) {
          onNotFoundRef.current();
          setError(null);
        } else {
          setError(err.message);
        }
        return;
      }

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
      setError(null);
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
