// src/shared/types/tenancy.ts
/**
 * Tenancy domain constants and types (framework-agnostic).
 *
 * Mirrors bslt's @bslt/shared/core tenant role/status definitions so these types port
 * into the monorepo unchanged. A "creator workspace" in the Blendtune UI is a tenant.
 */

/** Roles a user can hold within a tenant, most-privileged first. */
export const TENANT_ROLES = ['owner', 'admin', 'member', 'viewer'] as const;
export type TenantRole = (typeof TENANT_ROLES)[number];

/** Lifecycle states of a tenant invitation. */
export const INVITATION_STATUSES = ['pending', 'accepted', 'revoked', 'expired'] as const;
export type InvitationStatus = (typeof INVITATION_STATUSES)[number];

/** True if `value` is a valid tenant role. */
export const isTenantRole = (value: unknown): value is TenantRole =>
  typeof value === 'string' && (TENANT_ROLES as readonly string[]).includes(value);
