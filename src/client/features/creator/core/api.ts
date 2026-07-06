// src/client/features/creator/core/api.ts
/**
 * Creator API client — thin fetch wrappers over /api/creator/*.
 *
 * The active workspace travels as the x-tenant-slug header (the server verifies membership);
 * creator data is always fetched fresh (no-store) since it is the editing surface.
 */

import type { Track } from '@shared/types/track';
import type { CreatedTrack, WorkspaceSummary } from '@shared/types/creator';
import type { NewTrackData } from '@shared/validation/track';

/** Error carrying the HTTP status and the API's stable error code. */
export class CreatorApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'CreatorApiError';
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...init });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (body as { error?: string; message?: string } | null)?.error ??
      (body as { message?: string } | null)?.message ??
      `Request failed (${response.status})`;
    throw new CreatorApiError(message, response.status, (body as { code?: string } | null)?.code);
  }
  return body as T;
}

const tenantHeaders = (slug: string): HeadersInit => ({ 'x-tenant-slug': slug });

/** Workspaces the signed-in user belongs to. */
export async function fetchWorkspaces(): Promise<WorkspaceSummary[]> {
  const { workspaces } = await request<{ workspaces: WorkspaceSummary[] }>(
    '/api/creator/workspaces',
  );
  return workspaces;
}

/** The workspace's own catalog as a list (the API returns a keyed object; empty is valid). */
export async function fetchWorkspaceCatalog(slug: string): Promise<Track[]> {
  const catalog = await request<Record<string, Track>>('/api/creator/tracks', {
    headers: tenantHeaders(slug),
  });
  return Object.values(catalog);
}

/** Add a track's catalog metadata to the workspace. */
export async function createWorkspaceTrack(
  slug: string,
  input: NewTrackData,
): Promise<CreatedTrack> {
  return request<CreatedTrack>('/api/creator/tracks', {
    method: 'POST',
    headers: { ...tenantHeaders(slug), 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}
