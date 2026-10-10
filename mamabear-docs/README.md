# MamaBear Docs

Situs dokumentasi MamaBear, terpisah dari toko online. Dibangun dengan Next.js App Router, Fumadocs, dan MDX.

Ada dua bagian:

| Bagian | URL | Akses |
|---|---|---|
| User Guide | `/docs/user` | Publik |
| Developer Guide | `/docs/developer` | Basic Auth |

Next.js 16 memakai `proxy.ts` sebagai pengganti `middleware.ts`. Proteksi developer ada di file itu, sebelum konten MDX, gambar OG, atau markdown mentah dikirim.

## Setup

```bash
cd mamabear-docs
cp .env.example .env.local
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Isi `.env.local`:

| Variabel | Keterangan |
|---|---|
| `DOCS_USER` | Username Basic Auth. Contoh di `.env.example`: `admin`. |
| `DOCS_PASSWORD` | Password Basic Auth. Wajib diisi. Jika kosong, seluruh `/docs/developer` ditolak. |

User Guide tidak memakai variabel ini.

## Scripts

| Command | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | ESLint |
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

Tanpa `DOCS_PASSWORD`, Developer Guide tetap tertutup.
