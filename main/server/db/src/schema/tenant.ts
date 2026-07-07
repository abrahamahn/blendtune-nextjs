// src/server/db/schema/tenant.ts
/**
 * Tenant schema types — TypeScript interfaces + camelCase→snake_case column maps for the
 * tenants / memberships / invitations tables. Maps to migration 0100_tenants.sql.
 *
 * Mirrors bslt's main/server/db/src/schema/tenant.ts (minus columns added by later bslt
 * migrations — isBillingAdmin, reminderSentAt) so this file ports with minimal edits.
 */

import type { TenantRole } from '@shared/types/tenancy';

export type { TenantRole };

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
