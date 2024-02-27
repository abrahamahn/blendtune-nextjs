/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blendtune-public.nyc3.cdn.digitaloceanspaces.com',
        port: '',
        pathname: '/artwork/**',
      },
      {
        protocol: 'https',
        hostname: 'blendtune-public.nyc3.digitaloceanspaces.com',
        port: '',
        pathname: '/artwork/**',
      },
    ],
  },
};

module.exports = nextConfig;
