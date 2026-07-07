// main/apps/web/vite.config.ts
/**
 * Vite config for the Blendtune SPA (mirrors bslt's apps/web: explicit alias table,
 * /api dev proxy to the Fastify server, repo-root public/ assets).
 */

import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repo = (...p: string[]) => path.resolve(__dirname, '../../..', ...p);

export default defineConfig({
  // Explicit root so the app builds the same whether vite runs here or from the repo root.
  root: __dirname,
  plugins: [react()],
  publicDir: repo('public'),
  resolve: {
    alias: {
      '@/shared': repo('main/shared/src'),
      '@shared': repo('main/shared/src'),
      '@types': repo('main/shared/src/types'),
      '@client': repo('main/apps/web/src/client'),
      '@features': repo('main/apps/web/src/client/features'),
      '@core': repo('main/apps/web/src/client/core'),
      '@components': repo('main/apps/web/src/client/shared/components'),
      '@router': repo('main/client/react/src/router'),
      '@ui': repo('main/client/ui/src'),
    },
  },
  server: {
    port: Number(process.env.VITE_DEV_PORT ?? 5173),
    proxy: {
      '/api': { target: process.env.VITE_PROXY_TARGET ?? 'http://127.0.0.1:8080', changeOrigin: true },
      '/health': { target: process.env.VITE_PROXY_TARGET ?? 'http://127.0.0.1:8080', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: { 'vendor-react': ['react', 'react-dom'] },
      },
    },
  },
});
