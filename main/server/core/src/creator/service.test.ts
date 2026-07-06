// src/server/core/creator/service.test.ts
import { canWriteCatalog, createTrack, listWorkspaces } from './service';
import { BadRequestError, ConflictError, ForbiddenError } from '../errors';
import type { TenantRepository, TenantWithRole } from '@server/db/repositories/tenant';
import type { TracksRepository, TrackInfoRow } from '@server/db/repositories/tracks';
import type { Tenant } from '@server/db/schema/tenant';

const tenant: Tenant = {
  id: 't-1',
  name: 'Meekah',
  slug: 'meekah',
  logoUrl: null,
  ownerId: 'u-1',
  isActive: true,
  metadata: {},
  allowedEmailDomains: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function tenantsRepo(memberships: TenantWithRole[]): TenantRepository {
  return {
    findById: async () => null,
    findBySlug: async () => null,
    create: async () => tenant,
    listForUser: async () => memberships,
    findMembership: async () => null,
    createMembership: async () => {
      throw new Error('unused');
    },
  };
}

function tracksRepo(over: Partial<TracksRepository> = {}): TracksRepository {
  return {
    listAll: async () => [],
    listByTenant: async () => [],
    createForTenant: async (tenantId, input) =>
      ({ id: 63, track_catalog: input.catalog, track_title: input.title }) as TrackInfoRow,
    ...over,
  };
}

describe('listWorkspaces', () => {
  it('maps memberships to workspace summaries with role', async () => {
    const workspaces = await listWorkspaces(
      { tenants: tenantsRepo([{ tenant, role: 'owner' }]) },
      'u-1',
    );
    expect(workspaces).toEqual([
      { id: 't-1', name: 'Meekah', slug: 'meekah', logoUrl: null, role: 'owner' },
    ]);
  });

  it('returns an empty list for a user with no workspaces', async () => {
    expect(await listWorkspaces({ tenants: tenantsRepo([]) }, 'u-2')).toEqual([]);
  });
});

describe('canWriteCatalog', () => {
  it('allows owner/admin/member and denies viewer', () => {
    expect(canWriteCatalog('owner')).toBe(true);
    expect(canWriteCatalog('admin')).toBe(true);
    expect(canWriteCatalog('member')).toBe(true);
    expect(canWriteCatalog('viewer')).toBe(false);
  });
});

describe('createTrack', () => {
  const ctx = { tenantId: 't-1', role: 'owner' as const };

  it('validates, inserts scoped to the tenant, and echoes the identity', async () => {
    const calls: unknown[] = [];
    const tracks = tracksRepo({
      createForTenant: async (tenantId, input) => {
        calls.push([tenantId, input]);
        return { id: 63, track_catalog: input.catalog, track_title: input.title } as TrackInfoRow;
      },
    });
    const created = await createTrack({ tracks }, ctx, { catalog: 'mkh063', title: 'Playa' });
    expect(created).toEqual({ id: 63, catalog: 'mkh063', title: 'Playa' });
    expect(calls).toEqual([['t-1', { catalog: 'mkh063', title: 'Playa' }]]);
  });

  it('rejects viewers before touching the repository', async () => {
    const tracks = tracksRepo({
      createForTenant: async () => {
        throw new Error('must not be called');
      },
    });
    await expect(
      createTrack({ tracks }, { tenantId: 't-1', role: 'viewer' }, { catalog: 'x1', title: 'T' }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('throws BadRequest with field details for invalid input', async () => {
    await expect(createTrack({ tracks: tracksRepo() }, ctx, { title: 'T' })).rejects.toThrow(
      BadRequestError,
    );
  });

  it('maps a unique violation to Conflict', async () => {
    const tracks = tracksRepo({
      createForTenant: async () => {
        throw Object.assign(new Error('duplicate key'), { code: '23505' });
      },
    });
    await expect(
      createTrack({ tracks }, ctx, { catalog: 'mkh049', title: 'Shark' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('rethrows non-unique repository errors untouched', async () => {
    const tracks = tracksRepo({
      createForTenant: async () => {
        throw new Error('connection lost');
      },
    });
    await expect(
      createTrack({ tracks }, ctx, { catalog: 'mkh063', title: 'Playa' }),
    ).rejects.toThrow('connection lost');
  });
});
