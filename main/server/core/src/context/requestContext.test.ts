// src/server/core/context/requestContext.test.ts
import { requireTenant, resolveRequestContext } from './requestContext';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import type { TenantRepository } from '@server/db/repositories/tenant';
import type { Membership, Tenant } from '@server/db/schema/tenant';

const tenant: Tenant = {
  id: 't-1',
  name: 'Blendtune',
  slug: 'blendtune',
  logoUrl: null,
  ownerId: 'u-1',
  isActive: true,
  metadata: {},
  allowedEmailDomains: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const membership: Membership = {
  id: 'm-1',
  tenantId: 't-1',
  userId: 'u-1',
  role: 'owner',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function fakeRepo(overrides: Partial<TenantRepository> = {}): TenantRepository {
  return {
    findById: async () => null,
    findBySlug: async () => null,
    create: async () => tenant,
    listForUser: async () => [],
    findMembership: async () => null,
    createMembership: async () => membership,
    ...overrides,
  };
}

describe('resolveRequestContext', () => {
  it('returns an unscoped (marketplace) context when no slug is requested', async () => {
    const ctx = await resolveRequestContext({ userId: 'u-1' }, { tenants: fakeRepo() });
    expect(ctx).toEqual({ userId: 'u-1', tenantId: null, role: null });
  });

  it('throws NotFound for an unknown workspace slug', async () => {
    await expect(
      resolveRequestContext({ userId: 'u-1', tenantSlug: 'ghost' }, { tenants: fakeRepo() }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws Forbidden when the user is not a member of the workspace', async () => {
    const tenants = fakeRepo({ findBySlug: async () => tenant, findMembership: async () => null });
    await expect(
      resolveRequestContext({ userId: 'u-2', tenantSlug: 'blendtune' }, { tenants }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('returns the scoped context with role for a member', async () => {
    const tenants = fakeRepo({
      findBySlug: async () => tenant,
      findMembership: async () => membership,
    });
    const ctx = await resolveRequestContext(
      { userId: 'u-1', tenantSlug: 'blendtune' },
      { tenants },
    );
    expect(ctx).toEqual({ userId: 'u-1', tenantId: 't-1', role: 'owner' });
  });
});

describe('requireTenant', () => {
  it('narrows a workspace-scoped context', () => {
    expect(requireTenant({ userId: 'u-1', tenantId: 't-1', role: 'owner' })).toEqual({
      userId: 'u-1',
      tenantId: 't-1',
      role: 'owner',
    });
  });

  it('throws BadRequest when no workspace is active', () => {
    expect(() => requireTenant({ userId: 'u-1', tenantId: null, role: null })).toThrow(
      BadRequestError,
    );
  });
});
