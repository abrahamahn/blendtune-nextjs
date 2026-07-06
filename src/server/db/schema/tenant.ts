// src/server/db/schema/tenant.ts
/**
 * Tenant schema types — TypeScript interfaces + camelCase→snake_case column maps for the
 * tenants / memberships / invitations tables. Maps to migration 0100_tenants.sql.
 *
 * Mirrors bslt's main/server/db/src/schema/tenant.ts (minus columns added by later bslt
 * migrations — isBillingAdmin, reminderSentAt) so this file ports with minimal edits.
 */

import { INVITATION_STATUSES, type InvitationStatus, type TenantRole } from '@shared/types/tenancy';

export { INVITATION_STATUSES };
export type { InvitationStatus, TenantRole };

/** Flat role list for SQL value checks. */
export const TENANT_ROLES = ['owner', 'admin', 'member', 'viewer'] as const satisfies readonly TenantRole[];

export const TENANTS_TABLE = 'tenants';
export const MEMBERSHIPS_TABLE = 'memberships';
export const INVITATIONS_TABLE = 'invitations';

// ============================================================================
// Tenant
// ============================================================================

/** Tenant record (SELECT result). @see 0100_tenants.sql */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  ownerId: string;
  isActive: boolean;
  metadata: Record<string, unknown>;
  allowedEmailDomains: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewTenant {
  id?: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  ownerId: string;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
  allowedEmailDomains?: string[];
}

export interface UpdateTenant {
  name?: string;
  slug?: string;
  logoUrl?: string | null;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
  allowedEmailDomains?: string[];
}

// ============================================================================
// Membership
// ============================================================================

/** Membership record — a user's role within a tenant. @see 0100_tenants.sql */
export interface Membership {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewMembership {
  id?: string;
  tenantId: string;
  userId: string;
  role?: TenantRole;
}

export interface UpdateMembership {
  role?: TenantRole;
}

// ============================================================================
// Invitation
// ============================================================================

/** Invitation record — an email invite to join a tenant. @see 0100_tenants.sql */
export interface Invitation {
  id: string;
  tenantId: string;
  email: string;
  role: TenantRole;
  status: InvitationStatus;
  invitedById: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
}

export interface NewInvitation {
  id?: string;
  tenantId: string;
  email: string;
  role?: TenantRole;
  status?: InvitationStatus;
  invitedById: string;
  expiresAt: Date;
}

export interface UpdateInvitation {
  status?: InvitationStatus;
  acceptedAt?: Date | null;
  expiresAt?: Date;
}

// ============================================================================
// Column maps (camelCase TS → snake_case SQL)
// ============================================================================

export const TENANT_COLUMNS = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logoUrl: 'logo_url',
  ownerId: 'owner_id',
  isActive: 'is_active',
  metadata: 'metadata',
  allowedEmailDomains: 'allowed_email_domains',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export const MEMBERSHIP_COLUMNS = {
  id: 'id',
  tenantId: 'tenant_id',
  userId: 'user_id',
  role: 'role',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export const INVITATION_COLUMNS = {
  id: 'id',
  tenantId: 'tenant_id',
  email: 'email',
  role: 'role',
  status: 'status',
  invitedById: 'invited_by_id',
  expiresAt: 'expires_at',
  acceptedAt: 'accepted_at',
  createdAt: 'created_at',
} as const;
