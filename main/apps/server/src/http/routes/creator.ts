// main/apps/server/src/http/routes/creator.ts
/**
 * Creator surface routes — workspace listing + tenant-scoped catalog management.
 * Queries run on a session-scoped RawDb so RLS enforces isolation at the database.
 */

import type { FastifyInstance, FastifyRequest } from 'fastify';

import { db } from '@server/db';
import { createTenantRepository } from '@server/db/repositories/tenant';
import { createTracksRepository } from '@server/db/repositories/tracks';
import { requireTenant, type TenantContext } from '@server/core/context';
import { createTrack, listWorkspaces } from '@server/core/creator';
import { listTenantCatalog } from '@server/core/tracks';
import { getRequestContext } from '../../bootstrap/context';

const scopedTracksRepo = (ctx: TenantContext) =>
  createTracksRepository(
    db.withSession({ userId: ctx.userId, tenantId: ctx.tenantId, role: ctx.role }),
  );

export function registerCreatorRoutes(app: FastifyInstance): void {
  app.get('/creator/workspaces', async (req, reply) => {
    const ctx = await getRequestContext(req);
    const workspaces = await listWorkspaces({ tenants: createTenantRepository(db) }, ctx.userId);
    return reply.status(200).send({ workspaces });
  });

  app.get('/creator/tracks', async (req, reply) => {
    const ctx = requireTenant(await getRequestContext(req));
    const catalog = await listTenantCatalog({ tracks: scopedTracksRepo(ctx) }, ctx.tenantId);
    return reply.status(200).send(catalog);
  });

  app.post('/creator/tracks', async (req: FastifyRequest<{ Body: unknown }>, reply) => {
    const ctx = requireTenant(await getRequestContext(req));
    const track = await createTrack({ tracks: scopedTracksRepo(ctx) }, ctx, req.body ?? null);
    return reply.status(201).send(track);
  });
}
