'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

interface DocsLogoutButtonProps {
  className?: string;
  variant?: 'button' | 'badge';
}

export function DocsLogoutButton({ className = '', variant = 'button' }: DocsLogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/docs/api/logout', { method: 'POST' });
    } catch {
      // fallback
    }
    window.location.href = '/docs';
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        title="Keluar dari Developer Docs"
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors disabled:opacity-50 ${className}`}
      >
        <LogOut className="size-3.5" />
        <span>{loading ? 'Keluar...' : 'Keluar'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Keluar dari Developer Docs"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-secondary/70 px-3 py-1.5 text-xs font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground disabled:opacity-50 ${className}`}
    >
      <LogOut className="size-3.5" />
      <span>{loading ? 'Keluar...' : 'Logout'}</span>
    </button>
  );
}

