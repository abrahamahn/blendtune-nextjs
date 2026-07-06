// src/server/core/context/header.ts
/**
 * Header carrying the resolved workspace slug from middleware to route handlers.
 * Kept dependency-free so the Edge-runtime middleware can import it without pulling in `pg`.
 */
export const TENANT_SLUG_HEADER = 'x-tenant-slug';
