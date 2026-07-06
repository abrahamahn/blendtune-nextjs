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
      '@/client': repo('src/client'),
      '@client': repo('src/client'),
      '@app': repo('src/client/app'),
      '@features': repo('src/client/features'),
      '@auth': repo('src/client/features/auth'),
      '@layout': repo('src/client/features/layout'),
      '@player': repo('src/client/features/player'),
      '@sounds': repo('src/client/features/sounds'),
      '@home': repo('src/client/features/home'),
      '@tracks': repo('src/client/features/tracks'),
      '@filters': repo('src/client/features/sounds/filters'),
      '@category': repo('src/client/features/sounds/category'),
      '@search': repo('src/client/features/sounds/search'),
      '@visualizer': repo('src/client/features/player/visualizer'),
      '@catalog': repo('src/client/features/sounds/catalog'),
      '@header': repo('src/client/features/layout/header'),
      '@footer': repo('src/client/features/layout/footer'),
      '@leftbar': repo('src/client/features/layout/leftbar'),
      '@rightbar': repo('src/client/features/layout/rightbar'),
      '@core': repo('src/client/core'),
      '@components': repo('src/client/shared/components'),
      '@utils': repo('src/client/shared/utils'),
      '@hooks': repo('src/client/shared/hooks'),
      '@constants': repo('src/client/shared/constants'),
      '@styles': repo('src/client/shared/styles'),
      '@providers': repo('src/client/core/providers'),
      '@store': repo('src/client/core/store'),
      '@context': repo('src/client/core/context'),
      '@services': repo('src/client/core/services'),
      '@router': repo('main/client/react/src/router'),
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
