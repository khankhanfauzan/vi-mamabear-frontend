# MamaBear Docs

Situs dokumentasi MamaBear, terpisah dari toko online. Dibangun dengan Next.js App Router, Fumadocs, dan MDX.

Ada dua bagian:

| Bagian | URL | Akses |
|---|---|---|
| User Guide | `/docs/user` | Publik |
| Developer Guide | `/docs/developer` | Login internal, fallback HTTP Basic Auth |

Next.js 16 memakai `proxy.ts` sebagai pengganti `middleware.ts`. Proteksi developer ada di file itu, sebelum konten MDX, gambar OG, atau markdown mentah dikirim.

## Setup

```bash
cd mamabear-docs
cp .env.example .env.local
npm ci
npm run dev -- --port 3001
```

Buka [http://localhost:3001](http://localhost:3001).

Isi `.env.local`:

| Variabel | Keterangan |
|---|---|
| `DOCS_USER` | Username Basic Auth. Contoh di `.env.example`: `admin`. |
| `DOCS_PASSWORD` | Password Basic Auth. Wajib diisi. Jika kosong, seluruh `/docs/developer` ditolak. |

Tambahkan `DOCS_SESSION_SECRET` dengan nilai acak independen untuk salt sesi. User Guide tidak memakai variabel ini.

## Scripts

| Command | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | ESLint |
| `npm run docs:validate` | YAML, MDX, sidebar, link, heading, dan asset lokal |
| `npm run types:check` | Pemeriksaan tipe |

## Menambah halaman

1. Pilih bagian:
   - publik: `content/docs/user`
   - internal: `content/docs/developer`
2. Buat file MDX. Nama file menjadi slug URL.

```mdx
---
title: Judul halaman
description: Satu kalimat tentang halaman ini.
---

Isi halaman.
```

3. Daftarkan slug-nya di `meta.json` pada folder yang sama. Urutan array `pages` adalah urutan sidebar.

```json
{
  "title": "User Guide",
  "pages": ["index", "belanja", "promo"]
}
```

File `promo.mdx` di `content/docs/user` tampil di `/docs/user/promo`. File yang sama di `content/docs/developer` tampil di `/docs/developer/promo` dan ikut Basic Auth.

Jangan menulis password, token, atau isi file env ke dalam MDX.

## Deploy

Aplikasi ini perlu server, karena Basic Auth berjalan di `proxy.ts`. Jangan memakai static export.

Di hosting (misalnya Vercel), set root directory ke `mamabear-docs`, lalu isi environment:

- `DOCS_USER`
- `DOCS_PASSWORD`
- `DOCS_SESSION_SECRET`

Tanpa `DOCS_PASSWORD`, Developer Guide tetap tertutup.

## Verifikasi dan bukti

Konten teknis berada di `content/docs/developer`. Screenshot publik asli berada
pada `public/docs/frontend` dan `public/docs/backend`. Sumber/manifest API dan
screenshot ada pada `../docs/evidence`; file tersebut tidak disajikan sebagai
asset publik. Hasil pemeriksaan lengkap ada pada halaman internal
`/docs/developer/development/quality-assurance`.

Dari root repository, `node scripts/docs/generate-api-reference.mjs` menghasilkan
referensi dari snapshot OpenAPI yang sudah diverifikasi. Capture memakai
`node scripts/docs/capture-screenshots.mjs` dengan DOCS_CHROMIUM_PATH menuju
Chromium lokal; tidak ada dependency runtime screenshot.

Aplikasi docs dipulihkan dari origin/fumadocs (078fee8). TypeScript dev dependency
dipin ke 5.9.3 karena versi 7 pada branch sumber tidak didukung typescript-eslint
existing. Dependency runtime Fumadocs/Next/React tetap mengikuti aplikasi docs.
