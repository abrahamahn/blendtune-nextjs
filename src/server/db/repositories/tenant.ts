// src/server/db/repositories/tenant.ts
/**
 * Tenant + membership repository over the RawDb interface.
 *
 * Mirrors the shape of bslt's repositories (main/server/db/src/repositories/*): a factory
 * that closes over a RawDb and returns typed methods running parameterized SQL. Rows come
 * back snake_case from `pg`; the mappers convert to the camelCase domain types.
 */

import type { RawDb } from '../client';
import type { Membership, NewMembership, NewTenant, Tenant, TenantRole } from '../schema/tenant';

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  owner_id: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  allowed_email_domains: string[];
  created_at: Date;
  updated_at: Date;
}

interface MembershipRow {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantRole;
  created_at: Date;
  updated_at: Date;
}

const mapTenant = (r: TenantRow): Tenant => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  logoUrl: r.logo_url,
  ownerId: r.owner_id,
  isActive: r.is_active,
  metadata: r.metadata,
  allowedEmailDomains: r.allowed_email_domains,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const mapMembership = (r: MembershipRow): Membership => ({
  id: r.id,
  tenantId: r.tenant_id,
  userId: r.user_id,
  role: r.role,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export interface TenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  create(input: NewTenant): Promise<Tenant>;
  /** Tenants the user belongs to (via memberships), newest first. */
  listForUser(userId: string): Promise<Tenant[]>;
  findMembership(tenantId: string, userId: string): Promise<Membership | null>;
  createMembership(input: NewMembership): Promise<Membership>;
}

export function createTenantRepository(db: RawDb): TenantRepository {
  return {
    async findById(id) {
      const row = await db.queryOne<TenantRow>({
        text: 'SELECT * FROM tenants WHERE id = $1',
        values: [id],
      });
      return row ? mapTenant(row) : null;
    },

    async findBySlug(slug) {
      const row = await db.queryOne<TenantRow>({
        text: 'SELECT * FROM tenants WHERE slug = $1',
        values: [slug],
      });
      return row ? mapTenant(row) : null;
    },

    async create(input) {
      const row = await db.queryOne<TenantRow>({
        text: `INSERT INTO tenants (name, slug, logo_url, owner_id, is_active, metadata, allowed_email_domains)
               VALUES ($1, $2, $3, $4, COALESCE($5, TRUE), COALESCE($6, '{}'::jsonb), COALESCE($7, '{}'::text[]))
               RETURNING *`,
        values: [
          input.name,
          input.slug,
          input.logoUrl ?? null,
          input.ownerId,
          input.isActive ?? null,
          input.metadata ? JSON.stringify(input.metadata) : null,
          input.allowedEmailDomains ?? null,
        ],
      });
      if (!row) throw new Error('Failed to create tenant');
      return mapTenant(row);
    },

    async listForUser(userId) {
      const rows = await db.query<TenantRow>({
        text: `SELECT t.* FROM tenants t
               JOIN memberships m ON m.tenant_id = t.id
               WHERE m.user_id = $1
               ORDER BY t.created_at DESC`,
        values: [userId],
      });
      return rows.map(mapTenant);
    },

    async findMembership(tenantId, userId) {
      const row = await db.queryOne<MembershipRow>({
        text: 'SELECT * FROM memberships WHERE tenant_id = $1 AND user_id = $2',
        values: [tenantId, userId],
      });
      return row ? mapMembership(row) : null;
    },

    async createMembership(input) {
      const row = await db.queryOne<MembershipRow>({
        text: `INSERT INTO memberships (tenant_id, user_id, role)
               VALUES ($1, $2, COALESCE($3, 'member'))
               RETURNING *`,
        values: [input.tenantId, input.userId, input.role ?? null],
      });
      if (!row) throw new Error('Failed to create membership');
      return mapMembership(row);
    },
  };
}
