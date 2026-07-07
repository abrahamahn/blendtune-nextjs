// src/shared/types/tenancy.ts
/**
 * Tenancy domain constants and types (framework-agnostic).
 *
 * Mirrors bslt's @bslt/shared/core tenant role/status definitions so these types port
 * into the monorepo unchanged. A "creator workspace" in the Blendtune UI is a tenant.
 */

/** Roles a user can hold within a tenant, most-privileged first. */
export type TenantRole = 'owner' | 'admin' | 'member' | 'viewer';
