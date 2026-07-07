// src/server/core/tracks/service.ts
/**
 * Tracks catalog service (framework-agnostic).
 *
 * Business logic lifted out of the Next.js route so it can move into @bslt/core unchanged:
 * fetch catalog rows via the repository and shape them into the API response. Two entry
 * points mirror the marketplace split — `listPublicCatalog` (all tenants) and
 * `listTenantCatalog` (one creator workspace).
 */

import { NotFoundError } from '../errors';
import type { TracksRepository, TrackInfoRow } from '@server/db/repositories/tracks';

interface TrackResponse {
  id: number;
  file: string;
  metadata: { catalog: string; title: string; release: string; producer: string };
  info: {
    duration: string;
    bpm: string;
    key: { note: string; scale: string };
    genre: { maingenre: string; subgenre: string }[];
    relatedartist: string[];
    mood: string[];
    instruments: { main: string; sub: string }[];
  };
}

/** Keyed-by-sequential-id map, preserving the existing /api/tracks response shape. */
type TrackCatalog = Record<number, TrackResponse>;

interface TracksDeps {
  tracks: TracksRepository;
}

/** Shape a raw catalog row into the API response object. */
function toTrackResponse(track: TrackInfoRow, index: number): TrackResponse {
  return {
    id: index + 1,
    file: track.file_public,
    metadata: {
      catalog: track.track_catalog,
      title: track.track_title,
      release: track.release,
      producer: track.track_producer,
    },
    info: {
      duration: track.duration,
      bpm: track.bpm,
      key: { note: track.note, scale: track.scale },
      genre: [
        { maingenre: track.main_genre_1, subgenre: track.sub_genre_1 },
        { maingenre: track.main_genre_2, subgenre: track.sub_genre_2 },
      ],
      relatedartist: [track.related_artist_1, track.related_artist_2, track.related_artist_3],
      mood: [track.mood_1, track.mood_2, track.mood_3],
      instruments: [
        { main: track.instrument_1, sub: track.instrument_category_1 },
        { main: track.instrument_2, sub: track.instrument_category_2 },
        { main: track.instrument_3, sub: track.instrument_category_3 },
        { main: track.instrument_4, sub: track.instrument_category_4 },
        { main: track.instrument_5, sub: track.instrument_category_5 },
      ],
    },
  };
}

function toCatalog(rows: TrackInfoRow[]): TrackCatalog {
  if (rows.length === 0) {
    throw new NotFoundError('No tracks found in the database', 'TRACKS_EMPTY');
  }
  return rows.reduce<TrackCatalog>((acc, row, index) => {
    const track = toTrackResponse(row, index);
    acc[track.id] = track;
    return acc;
  }, {});
}

/** Marketplace catalog — every tenant's tracks. */
export async function listPublicCatalog({ tracks }: TracksDeps): Promise<TrackCatalog> {
  return toCatalog(await tracks.listAll());
}

/** A single creator workspace's catalog. Empty is valid — a new workspace has no tracks yet. */
export async function listTenantCatalog(
  { tracks }: TracksDeps,
  tenantId: string,
): Promise<TrackCatalog> {
  const rows = await tracks.listByTenant(tenantId);
  return rows.length === 0 ? {} : toCatalog(rows);
}
