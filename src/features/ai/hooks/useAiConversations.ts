"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAiConversations } from "@/features/ai/services/conversationService";
import { AiConversation } from "@/features/ai/types/conversation.types";

export function useAiConversations() {
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAiConversations();

      if (!isMountedRef.current) {
        return;
      }

      setConversations(result.conversations);
      setIsMock(result.isMock);
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }

      console.error("[useAiConversations] loadConversations failed:", err);
      setConversations([]);
      setIsMock(false);
      setError("Riwayat percakapan belum bisa dimuat. Coba lagi nanti.");
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void loadConversations();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadConversations]);

  return {
    conversations,
    isLoading,
    isMock,
    error,
    refetch: loadConversations,
  };
}
