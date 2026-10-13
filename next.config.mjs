/** @type {import('next').NextConfig} */
const DOCS_APP_URL =
  process.env.DOCS_APP_URL || 'https://vi-mamabear-frontend-n5v4.vercel.app';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Whenever the frontend calls /api/backend/..., Next.js forwards it to the backend service
        source: '/api/backend/:path*',
        destination: 'https://vi-mamabear-backend.onrender.com/api/:path*',
      },
      // Docs landing page (/docs -> /)
      {
        source: '/docs',
        destination: `${DOCS_APP_URL}/`,
      },
      // Docs subpaths (/docs/user, /docs/developer, etc.)
      {
        source: '/docs/:path*',
        destination: `${DOCS_APP_URL}/docs/:path*`,
      },
      // Docs static assets
      {
        source: '/docs-assets/_next/:path*',
        destination: `${DOCS_APP_URL}/_next/:path*`,
      },
      // Docs Fumadocs search API
      {
        source: '/api/search',
        destination: `${DOCS_APP_URL}/api/search`,
      },
    ];
  },
};

export default nextConfig;
