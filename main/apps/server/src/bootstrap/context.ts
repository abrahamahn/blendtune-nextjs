// main/apps/server/src/bootstrap/context.ts
/**
 * Request context helpers for the Fastify app (mirrors bslt's bootstrap/context.ts).
 *
 * Bridges HTTP concerns (cookies, headers) to the framework-agnostic core: session token →
 * userId, and the x-tenant-slug header → membership-verified tenant scope for RLS.
 */

import type { FastifyRequest } from 'fastify';

import { db } from '@server/db';
import { createTenantRepository } from '@server/db/repositories/tenant';
import { getUserIdFromSession } from '@server/core/sessions';
import { UnauthorizedError } from '@server/core/errors';
import {
  resolveRequestContext,
  TENANT_SLUG_HEADER,
  type RequestContext,
} from '@server/core/context';
import type { RequestMeta } from '@server/core/auth';

export const SESSION_COOKIE = 'sessionToken';

/** Session token from the cookie, else a Bearer Authorization header. */
export function extractSessionToken(req: FastifyRequest): string | null {
  const cookie = req.cookies[SESSION_COOKIE];
  if (cookie) return cookie;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice('Bearer '.length);
  return null;
}

/** Validate the session and return the authenticated user's UUID, or throw 401. */
export async function requireSession(req: FastifyRequest): Promise<string> {
  const token = extractSessionToken(req);
  if (!token) throw new UnauthorizedError('Unauthorized: No session token provided');
  const userId = await getUserIdFromSession(token);
  if (!userId) throw new UnauthorizedError('Unauthorized: Invalid or expired session token');
  return userId;
}

/** Resolve `{ userId, tenantId, role }`, verifying workspace membership when a slug is sent. */
export async function getRequestContext(req: FastifyRequest): Promise<RequestContext> {
  const userId = await requireSession(req);
  const tenantSlug = req.headers[TENANT_SLUG_HEADER];
  return resolveRequestContext(
    { userId, tenantSlug: typeof tenantSlug === 'string' ? tenantSlug : null },
    { tenants: createTenantRepository(db) },
  );
}

/** Client IP + user-agent for session records. */
export function extractRequestMeta(req: FastifyRequest): RequestMeta {
  return { ip: req.ip || 'unknown', userAgent: req.headers['user-agent'] || '' };
}
