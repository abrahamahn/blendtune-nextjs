// src/server/core/creator/service.ts
/**
 * Creator surface service (framework-agnostic).
 *
 * The tenant-scoped side of the marketplace: list the workspaces a user belongs to and
 * manage a workspace's catalog metadata. Writes assume the caller passes repositories bound
 * to a session-scoped RawDb (`db.withSession`) so RLS enforces tenant isolation underneath
 * the role checks here.
 */

import { BadRequestError, ConflictError, ForbiddenError } from '../errors';
import { parseNewTrack } from '@shared/validation/track';
import type { TenantRepository } from '@server/db/repositories/tenant';
import type { TracksRepository } from '@server/db/repositories/tracks';
import type { TenantRole } from '@shared/types/tenancy';
import type { CreatedTrack, WorkspaceSummary } from '@shared/types/creator';

export type { WorkspaceSummary, CreatedTrack };

/** Workspaces the user belongs to, with their role in each. */
export async function listWorkspaces(
  { tenants }: { tenants: TenantRepository },
  userId: string,
): Promise<WorkspaceSummary[]> {
  const memberships = await tenants.listForUser(userId);
  return memberships.map(({ tenant, role }) => ({
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    logoUrl: tenant.logoUrl,
    role,
  }));
}

/** True if the role may modify the workspace catalog (viewers are read-only). */
export const canWriteCatalog = (role: TenantRole): boolean => role !== 'viewer';

/** Postgres unique-violation, without importing pg types into core. */
const isUniqueViolation = (err: unknown): boolean =>
  typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505';

/**
 * Validate + insert a track's catalog metadata into the workspace.
 * The audio file itself is uploaded separately (storage port); this creates the listing.
 */
export async function createTrack(
  { tracks }: { tracks: TracksRepository },
  context: { tenantId: string; role: TenantRole },
  input: unknown,
): Promise<CreatedTrack> {
  if (!canWriteCatalog(context.role)) {
    throw new ForbiddenError('Viewers cannot modify the catalog', 'CATALOG_READ_ONLY');
  }

  const parsed = parseNewTrack(input);
  if (!parsed.ok) {
    const detail = Object.values(parsed.errors).join('; ');
    throw new BadRequestError(`Invalid track: ${detail}`, 'INVALID_TRACK');
  }

  try {
    const row = await tracks.createForTenant(context.tenantId, parsed.data);
    return { id: row.id, catalog: row.track_catalog, title: row.track_title };
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new ConflictError(
        `Catalog id "${parsed.data.catalog}" is already taken`,
        'TRACK_CATALOG_TAKEN',
      );
    }
    throw err;
  }
}
