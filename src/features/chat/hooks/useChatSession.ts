import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { chatService } from "../services/chatService";
import { useConversationHistory } from "./useConversationHistory";
import {
  CONVERSATION_STORAGE_KEY,
  type ChatMessage,
} from "../types/chat.types";

export const MAX_MESSAGE_LENGTH = 1000;

const OPENING_MESSAGE: ChatMessage = {
  id: "opening",
  role: "assistant",
  content: "Hai Mama! Ada yang bisa **MamaBear** bantu hari ini?",
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChatSession(options: { historyEnabled?: boolean } = {}) {
  const historyEnabled = options.historyEnabled ?? true;
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([
    OPENING_MESSAGE,
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const history = useConversationHistory(conversationId, {
    enabled: historyEnabled,
  });
  const usingHistory = Boolean(conversationId);
  const messages = usingHistory ? history.messages : localMessages;
  const setMessages = usingHistory ? history.setMessages : setLocalMessages;
  const remainingChars = MAX_MESSAGE_LENGTH - input.length;
  const canSend =
    input.trim().length > 0 &&
    input.length <= MAX_MESSAGE_LENGTH &&
    !isSending &&
    !(usingHistory && history.isLoading);

  useEffect(() => {
    const storedId = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (storedId) setConversationId(storedId);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (event?: FormEvent, textOverride?: string) => {
    event?.preventDefault();
    const text = (textOverride ?? input).trim();
    if (!text || text.length > MAX_MESSAGE_LENGTH || isSending) return;

    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", content: text },
    ]);
    setInput("");
    setIsSending(true);

    try {
      const response = await chatService.sendChatMessage(text, conversationId);

      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId);
        try {
          localStorage.setItem(CONVERSATION_STORAGE_KEY, response.conversationId);
        } catch {
          // ignore storage error
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: response.reply,
          products: response.products,
        },
      ]);
    } catch (err) {
      console.error("[useChatSession] sendChatMessage failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content:
            "Maaf Mama, saat ini AI MamaBear sedang terkendala menghubungi server. Silakan coba kirim lagi sebentar ya.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    sendMessage();
  };

  return {
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
    sendMessage,
    handleInputKeyDown,
    sendQuickReply: (label: string) => {
      setInput(label);
      sendMessage(undefined, label);
    },
  };
}
