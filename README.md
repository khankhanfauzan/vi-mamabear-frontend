# MamaBear Frontend

Aplikasi web MamaBear untuk belanja kebutuhan Mama: katalog produk, keranjang, checkout, akun, dan chat MamaBear Care. Proyek ini memakai **Next.js App Router**. Route hanya tinggal di `src/app`. Logika tiap fitur tinggal di `src/features`. Komponen yang dipakai di banyak halaman tinggal di `src/components`.

## Tech Stack

| Tech | Pemakaian |
|---|---|
| Next.js 14 (App Router) | Routing, layout, dan rendering |
| React 18 | UI |
| TypeScript | Tipe data |
| Tailwind CSS | Styling |
| Zustand | State klien, misalnya keranjang |
| NextAuth.js | Sesi login |
| React Hook Form | Form |
| Jest + Testing Library | Unit test |

## Setup

1. Clone repositori, lalu masuk ke folder proyek:

```bash
git clone https://github.com/khankhanfauzan/vi-mamabear-frontend.git
cd vi-mamabear-frontend
```

2. Salin `.env.example` ke `.env`:

```bash
cp .env.example .env
```

3. Sesuaikan variabel di `.env`. Daftar lengkapnya ada di bagian Environment Variables.

4. Install dependensi:

```bash
npm install
```

5. Jalankan aplikasi:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Environment Variables

Salin nama variabel dari `.env.example`. Jangan menambah nama baru di dokumentasi ini kalau belum ada di file itu.

| Variabel | Wajib | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Ya | URL backend, termasuk path `/api`. Contoh lokal: `http://localhost:3001/api`. Contoh dev yang sudah tertulis di `.env.example`: `https://vi-mamabear-backend.onrender.com/api`. |
| `NEXTAUTH_SECRET` | Ya | String acak untuk menandatangani sesi NextAuth. Ganti nilai contoh di `.env.example` sebelum dipakai bersama. |

`.env.example` memuat beberapa baris `NEXT_PUBLIC_API_URL`. Yang aktif adalah baris yang tidak diawali `#`. Sisakan satu nilai yang sesuai lingkungan Anda, lalu jadikan baris lainnya komentar.

## Struktur Folder

```text
src/
├── app/                 # Route Next.js App Router
│   ├── (auth)/          # Login, daftar, lupa password (grup ini tidak masuk URL)
│   ├── (shop)/          # Halaman pembeli: produk, keranjang, checkout, akun, chat
│   ├── admin/           # Dashboard admin
│   └── api/             # Route handler, termasuk NextAuth
├── features/            # Satu folder per domain bisnis
│   ├── account/
│   ├── address/
│   ├── admin/
│   ├── ai/
│   ├── auth/
│   ├── cart/
│   ├── categories/
│   ├── chat/
│   ├── checkout/
│   ├── home/
│   ├── orders/
│   └── products/
├── components/          # UI yang dipakai lintas fitur
│   ├── icons/
│   ├── layout/          # Navbar, footer, chat widget
│   └── ui/              # Primitif tombol, input, dialog, dan sejenisnya
├── lib/                 # API client, auth, dan helper bersama
├── providers/           # Provider React di root layout
├── store/               # State global di luar satu fitur
├── types/               # Tipe TypeScript bersama
├── utils/               # Formatter dan helper kecil
└── middleware.ts        # Perlindungan route
```

Cara memakainya:

- Tambah halaman baru di `src/app`, lalu panggil komponen dari `src/features`.
- Taruh komponen, hook, service, dan tipe yang hanya dipakai satu domain di dalam folder fitur itu.
- Taruh komponen yang dipakai lebih dari satu fitur di `src/components`.

## Scripts

| Command | Fungsi |
|---|---|
| `npm run dev` | Lint, lalu jalankan dev server |
| `npm run build` | Build production |
| `npm start` | Jalankan hasil build. Jalankan `npm run build` lebih dulu |
| `npm run lint` | ESLint |
| `npm test` | Unit test sekali jalan |
| `npm run test:watch` | Unit test dalam mode watch |
| `npm run generate:api` | Generate tipe OpenAPI ke `src/types/openapi/api.d.ts` |

Build production:

```bash
npm run build
npm start
```
