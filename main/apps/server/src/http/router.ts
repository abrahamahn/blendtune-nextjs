// main/apps/server/src/http/router.ts
/**
 * Route registrar (mirrors bslt's http/router.ts): all domain modules under /api,
 * plus the unprefixed /health probe.
 */

import type { FastifyInstance } from 'fastify';

import { db } from '@server/db';
import { registerAuthRoutes } from './routes/auth';
import { registerAccountRoutes } from './routes/account';
import { registerTracksRoutes } from './routes/tracks';
import { registerCreatorRoutes } from './routes/creator';
import { registerMediaRoutes } from './routes/media';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ ok: await db.healthCheck() }));

  await app.register(
    async (api) => {
      registerAuthRoutes(api);
      registerAccountRoutes(api);
      registerTracksRoutes(api);
      registerCreatorRoutes(api);
      registerMediaRoutes(api);
    },
    { prefix: '/api' },
  );
}
