# MamaBear - Platform Untuk Kebutuhan Mama

> Platform ini dikembangkan sebagai proyek Virtual Internship RevoU, yang menyediakan produk untuk Mama

Link :

--- 
 
 ## Overview
MamaBear adalah platform e-commerce yang dirancang khusus untuk mendukung kebutuhan wanita selama masa kehamilan, persiapan persalinan, hingga masa menyusui dan perawatan pasca melahirkan.

Platform ini menyediakan berbagai produk nutrisi, kebutuhan ibu, dan perlengkapan pendukung untuk membantu Mama dan Si Kecil menjalani perjalanan yang lebih sehat dan nyaman.

## Screenshots

Screenshots bisa ditambahkan setelah deployment

| Feature | Status |
|----------|----------|
| Home Page | Pending |
| Categories | Pending |
| Product Detail | Pending |
| Cart | Pending |
| Checkout | Pending |
| Admin Dashboard | Pending |

## Features

- Authentication
- Home Page
- Cart
- Checkout
- Product Categories
- Product Detail
- Product Search
- Admin Dashboard

## Tech Stack

### Frontend
| Tech | Usage |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | Client state management |

## Getting Started

1. Clone the repo:

```bash
git clone https://github.com/revou-fsse/mamabear-frontend.git
cd mamabear-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL="https://mamabear-backend-dev.up.railway.app/api"
```

4. Run development server:

```bash
npm run dev
```

---

## Project Structure

```text
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (shop)/                   # Customer-facing pages
│   ├── admin/                    # Admin dashboard & management
│   ├── api/                      # API routes
│   └── ...

├── components/                   # Reusable UI components
│   ├── icons/
│   ├── layout/
│   └── ui/

├── features/                     # Feature-based modules
│   ├── account/
│   ├── address/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── categories/
│   ├── checkout/
│   ├── home/
│   ├── orders/
│   └── products/

├── lib/                          # Shared utilities & helpers
│   ├── hooks/
│   └── ...

├── store/                        # Global state management
├── types/                        # Shared TypeScript types
└── middleware.ts                 # Route protection & middleware
```

---

## Credit

Proyek ini merupakan bagian dari program Virtual Internship RevoU x MamaBear.