'use client';

import { useEffect, useState } from "react";

const STORAGE_KEY = 'newsletter-dismissed';

export function useNewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasDismissed = localStorage.getItem(STORAGE_KEY);

        if (!hasDismissed) {
            const timer = setTimeout(() => setIsOpen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []); // only runs once when first mounted

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsOpen(false);
    };

    const onSubscribe = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsOpen(false);
        // todo: connect to API backend (email)
    };

    return { isOpen, dismiss, onSubscribe };
}