import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  agentRules: false,
  assetPrefix:
    process.env.DOCS_ASSET_PREFIX || 'https://vi-mamabear-frontend-n5v4.vercel.app',
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default withMDX(config);
