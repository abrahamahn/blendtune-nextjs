// src/server/core/context/nextContext.ts
/**
 * Next.js adapter for request-context resolution. Bridges the framework-agnostic
 * resolveRequestContext to a NextRequest: derive the user from the session cookie and the
 * active workspace from the x-tenant-slug header (set by middleware for /c/:slug routes).
 */

import { NextRequest } from 'next/server';

import { db } from '@server/db';
import { createTenantRepository } from '@server/db/repositories/tenant';
import { extractSessionToken } from '@server/lib/auth/session';
import { getUserIdFromSession } from '@server/core/sessions';
import { UnauthorizedError } from '../errors';
import { resolveRequestContext, type RequestContext } from './requestContext';
import { TENANT_SLUG_HEADER } from './header';

/** Resolve `{ userId, tenantId, role }` for an authenticated request. */
export async function getRequestContext(req: NextRequest): Promise<RequestContext> {
  const token = await extractSessionToken(req);
  if (!token) throw new UnauthorizedError('Unauthorized: No session token provided');

  const userId = await getUserIdFromSession(token);
  if (!userId) throw new UnauthorizedError('Unauthorized: Invalid or expired session token');

  const tenantSlug = req.headers.get(TENANT_SLUG_HEADER);
  return resolveRequestContext({ userId, tenantSlug }, { tenants: createTenantRepository(db) });
}
