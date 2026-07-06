// src/shared/types/creator.ts
/**
 * Creator API contract types, shared by the server handlers and the client feature so the
 * two can never drift. A "workspace" is the UI name for a tenant.
 */

import type { TenantRole } from './tenancy';

/** A workspace as returned by GET /api/creator/workspaces. */
export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: TenantRole;
}

/** The created track's identity, as returned by POST /api/creator/tracks. */
export interface CreatedTrack {
  id: number;
  catalog: string;
  title: string;
}
