"use client";

import { useEffect, useState } from "react";

export const NEWSLETTER_STORAGE_KEY = "newsletter-dismissed";
export const NEWSLETTER_CLOSED_EVENT = "mamabear:newsletter-closed";

function notifyNewsletterClosed() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NEWSLETTER_CLOSED_EVENT));
}

export function useNewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem(NEWSLETTER_STORAGE_KEY);

    if (!hasDismissed) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(NEWSLETTER_STORAGE_KEY, "true");
    setIsOpen(false);
    notifyNewsletterClosed();
  };

  const onSubscribe = () => {
    localStorage.setItem(NEWSLETTER_STORAGE_KEY, "true");
    setIsOpen(false);
    notifyNewsletterClosed();
  };

  return { isOpen, dismiss, onSubscribe };
}
