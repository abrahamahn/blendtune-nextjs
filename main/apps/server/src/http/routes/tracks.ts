// main/apps/server/src/http/routes/tracks.ts
/**
 * Marketplace catalog route — every tenant's tracks, same shape as the Next handler.
 */

import type { FastifyInstance } from 'fastify';

import { db } from '@server/db';
import { createTracksRepository } from '@server/db/repositories/tracks';
import { listPublicCatalog } from '@server/core/tracks';

export function registerTracksRoutes(app: FastifyInstance): void {
  app.get('/tracks', async (_req, reply) => {
    const catalog = await listPublicCatalog({ tracks: createTracksRepository(db) });
    return reply.status(200).send(catalog);
  });
}
