// src/app/api/tracks/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@server/db';
import { createTracksRepository } from '@server/db/repositories/tracks';
import { listPublicCatalog } from '@server/core/tracks';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * GET /api/tracks — the public marketplace catalog (every tenant's tracks).
 *
 * Thin adapter: all catalog logic lives in @server/core/tracks so it can move into
 * @bslt/core unchanged. Errors (e.g. an empty catalog → 404) are raised as HttpError and
 * mapped by withErrorHandling.
 */
async function getTracksHandler(_req: NextRequest): Promise<NextResponse> {
  const catalog = await listPublicCatalog({ tracks: createTracksRepository(db) });
  return createJsonResponse(catalog, 200);
}

export const GET = withErrorHandling(getTracksHandler);
