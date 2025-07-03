import path from 'path';
import type { NextConfig } from 'next';
import ESLintPlugin from 'eslint-webpack-plugin';

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
  webpack: (config, { dev }) => {
    if (dev) {
      config.plugins.push(
        new ESLintPlugin({
          extensions: ['js', 'jsx', 'ts', 'tsx'],
          emitWarning: true,
        })
      );
    }

    // Alias @ to src
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
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
