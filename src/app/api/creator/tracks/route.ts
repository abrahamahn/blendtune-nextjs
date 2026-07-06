// src/app/api/creator/tracks/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@server/db';
import { createTracksRepository } from '@server/db/repositories/tracks';
import { getRequestContext, requireTenant, type TenantContext } from '@server/core/context';
import { createTrack } from '@server/core/creator';
import { listTenantCatalog } from '@server/core/tracks';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * /api/creator/tracks — a workspace's own catalog.
 *
 * Callers select the workspace with the `x-tenant-slug` header (set by middleware for
 * /c/:slug pages, or sent directly by API clients); getRequestContext verifies membership.
 * Queries run on a session-scoped RawDb so RLS enforces isolation at the database.
 */
const scopedTracksRepo = (ctx: TenantContext) =>
  createTracksRepository(
    db.withSession({ userId: ctx.userId, tenantId: ctx.tenantId, role: ctx.role }),
  );

/** GET — list the workspace's catalog (empty object for a new workspace). */
async function listCreatorTracksHandler(req: NextRequest): Promise<NextResponse> {
  const ctx = requireTenant(await getRequestContext(req));
  const catalog = await listTenantCatalog({ tracks: scopedTracksRepo(ctx) }, ctx.tenantId);
  return createJsonResponse(catalog, 200);
}

/** POST — add a track's catalog metadata to the workspace (audio upload is separate). */
async function createCreatorTrackHandler(req: NextRequest): Promise<NextResponse> {
  const ctx = requireTenant(await getRequestContext(req));
  // Malformed JSON falls through to validation as null → 400 INVALID_TRACK, not a 500.
  const body: unknown = await req.json().catch(() => null);
  const track = await createTrack({ tracks: scopedTracksRepo(ctx) }, ctx, body);
  return createJsonResponse(track, 201);
}

export const GET = withErrorHandling(listCreatorTracksHandler);
export const POST = withErrorHandling(createCreatorTrackHandler);
