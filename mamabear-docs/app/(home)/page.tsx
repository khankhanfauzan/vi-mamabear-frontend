import Link from 'next/link';

const sections = [
  {
    href: '/docs/user',
    title: 'User Guide',
    access: 'Publik',
    description: 'Cara berbelanja, mengelola akun, dan memakai chat MamaBear Care.',
  },
  {
    href: '/docs/developer',
    title: 'Developer Guide',
    access: 'Internal',
    description: 'Arsitektur aplikasi dan cara menambah halaman. Butuh Basic Auth.',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-fd-muted-foreground">MamaBear Docs</p>
      <h1 className="mt-2 text-3xl font-bold">Dokumentasi MamaBear</h1>
      <p className="mt-3 text-fd-muted-foreground">
        Panduan pembeli terbuka untuk semua. Panduan developer hanya terbuka untuk tim.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border p-5 text-left transition-colors hover:bg-fd-accent"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
              {section.access}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{section.title}</h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
