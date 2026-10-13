'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextTarget = searchParams.get('next') || '/docs/developer';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/docs/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data?.ok) {
        // Full browser navigation ensures refreshed cookie headers are applied
        window.location.href = nextTarget;
      } else {
        setError(data?.error || 'Password salah. Silakan coba lagi.');
      }
    } catch {
      setError('Gagal menghubungi server. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-fd-border bg-fd-card p-8 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
          <Lock className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-fd-foreground">Developer Docs</h1>
          <p className="text-xs text-fd-muted-foreground">MamaBear Internal Documentation</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-fd-muted-foreground leading-relaxed">
        Halaman Developer Guide diproteksi khusus untuk tim internal MamaBear. Masukkan password untuk melanjutkan.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground mb-2">
            Password Dokumen
          </label>
          <div className="relative">
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
              className="w-full rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 ps-10 text-sm text-fd-foreground outline-none transition focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20"
              required
              autoFocus
            />
            <KeyRound className="absolute left-3.5 top-3 size-4 text-fd-muted-foreground" />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-fd-primary py-2.5 text-sm font-semibold text-fd-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Memverifikasi...' : 'Masuk ke Developer Docs'}
        </button>
      </form>

      <div className="mt-6 border-t border-fd-border pt-4 text-center">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-fd-muted-foreground transition hover:text-fd-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Beranda Dokumentasi</span>
        </Link>
      </div>
    </div>
  );
}

export default function DocsLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fd-background px-4 py-12">
      <Suspense fallback={
        <div className="text-sm text-fd-muted-foreground">Memuat halaman login...</div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}

