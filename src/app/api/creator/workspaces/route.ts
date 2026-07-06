// src/app/api/creator/workspaces/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@server/db';
import { createTenantRepository } from '@server/db/repositories/tenant';
import { getRequestContext } from '@server/core/context';
import { listWorkspaces } from '@server/core/creator';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** GET /api/creator/workspaces — the authenticated user's workspaces (for the switcher). */
async function getWorkspacesHandler(req: NextRequest): Promise<NextResponse> {
  const ctx = await getRequestContext(req);
  const workspaces = await listWorkspaces({ tenants: createTenantRepository(db) }, ctx.userId);
  return createJsonResponse({ workspaces }, 200);
}

export const GET = withErrorHandling(getWorkspacesHandler);
