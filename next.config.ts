import type { NextConfig } from 'next';

const isVercel = Boolean(process.env.VERCEL);

const config: NextConfig = {
  // On Vercel, run native Next.js static generation (zero configuration, edge-optimized)
  // Locally or on generic static hosts, export to /out
  output: isVercel ? undefined : 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false
};

export default config;
