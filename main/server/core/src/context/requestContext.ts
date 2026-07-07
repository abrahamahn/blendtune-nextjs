// src/server/core/context/requestContext.ts
/**
 * Request context resolution — the tenant-aware successor to bare `requireSession`.
 *
 * Framework-agnostic: given an authenticated userId and an optionally-requested tenant slug
 * (from the /c/:slug path or an active-workspace cookie), it verifies membership and returns
 * the scoped context. Mirrors bslt's contextualizeRequest (main/apps/server/src/bootstrap/
 * context.ts): a raw tenant identifier is never trusted — membership is always verified.
 *
 * The resolved { userId, tenantId, role } is what feeds RawDb.withSession() so RLS policies
 * (Phase 3) filter by `current_setting('app.tenant_id')`.
 */

import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import type { TenantRepository } from '@server/db/repositories/tenant';
import type { TenantRole } from '@shared/types/tenancy';

/** The scoped context for a request. `tenantId`/`role` are null when no workspace is active. */
export interface RequestContext {
  userId: string;
  tenantId: string | null;
  role: TenantRole | null;
}

/** A context guaranteed to be scoped to a workspace. */
export interface TenantContext {
  userId: string;
  tenantId: string;
  role: TenantRole;
}

/** Narrow a context to a workspace-scoped one, or 400 for tenant-required endpoints. */
export function requireTenant(ctx: RequestContext): TenantContext {
  if (ctx.tenantId === null || ctx.role === null) {
    throw new BadRequestError(
      'Active workspace required — send the x-tenant-slug header',
      'TENANT_REQUIRED',
    );
  }
  return { userId: ctx.userId, tenantId: ctx.tenantId, role: ctx.role };
}

interface ResolveContextInput {
  /** Authenticated user id (UUID) derived from the session. */
  userId: string;
  /** Requested tenant slug from the /c/:slug path or active-workspace cookie, if any. */
  tenantSlug?: string | null;
}

interface ContextDeps {
  tenants: TenantRepository;
}

/**
 * Resolve the tenant-scoped context for a request.
 *
 * - No slug → buyer/marketplace context: `{ userId, tenantId: null, role: null }`.
 * - Slug present → look up the tenant, then require the user to be a member; a non-member is
 *   Forbidden (never silently granted), an unknown slug is NotFound.
 */
export async function resolveRequestContext(
  { userId, tenantSlug }: ResolveContextInput,
  { tenants }: ContextDeps,
): Promise<RequestContext> {
  if (!tenantSlug) {
    return { userId, tenantId: null, role: null };
  }

  const tenant = await tenants.findBySlug(tenantSlug);
  if (!tenant) {
    throw new NotFoundError(`Workspace "${tenantSlug}" not found`, 'TENANT_NOT_FOUND');
  }

  const membership = await tenants.findMembership(tenant.id, userId);
  if (!membership) {
    throw new ForbiddenError('Workspace membership required', 'TENANT_MEMBERSHIP_REQUIRED');
  }

  return { userId, tenantId: tenant.id, role: membership.role };
}
