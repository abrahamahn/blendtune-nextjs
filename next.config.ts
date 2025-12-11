import type { NextConfig } from 'next';

// Load environment variables
require('./src/shared/config/loadEnv');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blendtune-public.nyc3.cdn.digitaloceanspaces.com',
        pathname: '/artwork/**',
      },
      {
        protocol: 'https',
        hostname: 'blendtune-public.nyc3.digitaloceanspaces.com',
        pathname: '/artwork/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/audio/streaming/:file',
        destination: '/api/audio/:file',
      },
    ];
  },
};

export default nextConfig;
