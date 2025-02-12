const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

require('./src/shared/config/loadEnv');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    
    return config;
  },
};

module.exports = nextConfig;