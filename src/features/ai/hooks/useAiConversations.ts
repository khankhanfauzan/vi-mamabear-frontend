"use client";

import { useEffect, useState } from "react";
import { fetchAiConversations } from "@/features/ai/services/conversationService";
import { AiConversation } from "@/features/ai/types/conversation.types";

export function useAiConversations() {
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchAiConversations();

        if (!isMounted) {
          return;
        }

        setConversations(result.conversations);
        setIsMock(result.isMock);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error("[useAiConversations] loadConversations failed:", err);
        setConversations([]);
        setIsMock(false);
        setError("Riwayat percakapan belum bisa dimuat. Coba lagi nanti.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    conversations,
    isLoading,
    isMock,
    error,
  };
}
