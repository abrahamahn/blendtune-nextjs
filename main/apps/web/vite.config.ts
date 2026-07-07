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
      '@auth': repo('main/apps/web/src/client/features/auth'),
      '@layout': repo('main/apps/web/src/client/features/layout'),
      '@player': repo('main/apps/web/src/client/features/player'),
      '@sounds': repo('main/apps/web/src/client/features/sounds'),
      '@home': repo('main/apps/web/src/client/features/home'),
      '@tracks': repo('main/apps/web/src/client/features/tracks'),
      '@filters': repo('main/apps/web/src/client/features/sounds/filters'),
      '@category': repo('main/apps/web/src/client/features/sounds/category'),
      '@search': repo('main/apps/web/src/client/features/sounds/search'),
      '@visualizer': repo('main/apps/web/src/client/features/player/visualizer'),
      '@catalog': repo('main/apps/web/src/client/features/sounds/catalog'),
      '@header': repo('main/apps/web/src/client/features/layout/header'),
      '@footer': repo('main/apps/web/src/client/features/layout/footer'),
      '@leftbar': repo('main/apps/web/src/client/features/layout/leftbar'),
      '@rightbar': repo('main/apps/web/src/client/features/layout/rightbar'),
      '@core': repo('main/apps/web/src/client/core'),
      '@components': repo('main/apps/web/src/client/shared/components'),
      '@utils': repo('main/apps/web/src/client/shared/utils'),
      '@hooks': repo('main/apps/web/src/client/shared/hooks'),
      '@constants': repo('main/apps/web/src/client/shared/constants'),
      '@styles': repo('main/apps/web/src/client/shared/styles'),
      '@providers': repo('main/apps/web/src/client/core/providers'),
      '@store': repo('main/apps/web/src/client/core/store'),
      '@context': repo('main/apps/web/src/client/core/context'),
      '@services': repo('main/apps/web/src/client/core/services'),
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
