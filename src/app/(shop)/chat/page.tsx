"use client";

import { CONVERSATION_STORAGE_KEY } from "@/features/chat/types/chat.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatIndexPage() {
  const router = useRouter();
  const [hasStoredConversation, setHasStoredConversation] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const storedId = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (storedId) {
      router.replace(`/chat/${storedId}`);
      return;
    }
    setHasStoredConversation(false);
  }, [router]);

  if (hasStoredConversation === null) {
    return (
      <div className="px-4 py-16 text-center text-sm text-[var(--color-gray)]">
        Memuat percakapan...
      </div>
    );
  }

  return (
    <div className="px-4 py-16 text-center">
      <h1 className="text-font-4 font-bold text-[var(--mama-brown)]">
        Online Chat
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-gray)]">
        Belum ada percakapan tersimpan. Buka tombol chat di beranda untuk mulai
        bertanya ke MamaBear Care.
      </p>
    </div>
  );
}
