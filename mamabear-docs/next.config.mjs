import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  agentRules: false,
  assetPrefix: process.env.DOCS_ASSET_PREFIX || '/docs-assets',
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  async rewrites() {
    return [
      {
        source: '/docs-assets/_next/:path*',
        destination: '/_next/:path*',
      },
    ];
  },
};

export default withMDX(config);
