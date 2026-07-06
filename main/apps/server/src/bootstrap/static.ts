// main/apps/server/src/bootstrap/static.ts
/**
 * Serve the built Vite SPA from Fastify in production (single-origin deploy: one process
 * serves both /api and the web app, so Caddy only needs one reverse_proxy). Enabled when
 * WEB_DIST points at the SPA's dist/ directory; dev uses the Vite server instead.
 *
 * Static assets are served directly; any other non-/api GET falls back to index.html so the
 * client router owns navigation (history-API fallback).
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';

export async function registerStaticWeb(app: FastifyInstance): Promise<boolean> {
  const root = process.env.WEB_DIST;
  if (!root) return false;
  if (!existsSync(join(root, 'index.html'))) {
    app.log.warn(`WEB_DIST=${root} has no index.html; static web not served`);
    return false;
  }

  await app.register(fastifyStatic, { root, wildcard: false });

  // SPA history fallback: serve index.html for client routes, but never for API paths
  // (those should 404 as JSON via the normal error handler).
  app.setNotFoundHandler((req, reply) => {
    if (req.method === 'GET' && !req.url.startsWith('/api/') && !req.url.startsWith('/health')) {
      return reply.type('text/html').sendFile('index.html');
    }
    return reply.status(404).send({ message: 'Not found' });
  });

  app.log.info(`Serving SPA from ${root}`);
  return true;
}
