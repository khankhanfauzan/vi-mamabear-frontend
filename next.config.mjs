/** @type {import('next').NextConfig} */
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
        // Whenever the frontend calls /api/backend/..., Next.js forwards it to Railway
        source: '/api/backend/:path*',
        destination: 'https://mamabear-backend-dev.up.railway.app/api/:path*',
      },
    ]
  }
};

export default nextConfig;
