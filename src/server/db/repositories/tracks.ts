// src/server/db/repositories/tracks.ts
/**
 * Track catalog repository over RawDb.
 *
 * Reads the meekah.track_info catalog. Marketplace browsing lists every tenant's tracks
 * (`listAll`); a creator workspace lists only its own (`listByTenant`). Rows are returned raw
 * (snake_case) and shaped into the API response by core/tracks/service.ts.
 */

import type { RawDb } from '../client';
import type { NewTrackData } from '@shared/validation/track';

/** A row of meekah.track_info as returned by `pg` (snake_case). */
export interface TrackInfoRow {
  id: number;
  release: string;
  file_public: string;
  track_catalog: string;
  track_title: string;
  track_producer: string;
  duration: string;
  bpm: string;
  note: string;
  scale: string;
  main_genre_1: string;
  sub_genre_1: string;
  main_genre_2: string;
  sub_genre_2: string;
  related_artist_1: string;
  related_artist_2: string;
  related_artist_3: string;
  mood_1: string;
  mood_2: string;
  mood_3: string;
  instrument_1: string;
  instrument_category_1: string;
  instrument_2: string;
  instrument_category_2: string;
  instrument_3: string;
  instrument_category_3: string;
  instrument_4: string;
  instrument_category_4: string;
  instrument_5: string;
  instrument_category_5: string;
  tenant_id: string;
}

export interface TracksRepository {
  /** Every track in the catalog (marketplace view, across all tenants). */
  listAll(): Promise<TrackInfoRow[]>;
  /** Tracks owned by a single tenant (creator workspace view). */
  listByTenant(tenantId: string): Promise<TrackInfoRow[]>;
  /**
   * Insert a track's catalog metadata for a tenant. Must run on a session-scoped RawDb
   * (`db.withSession({ tenantId, ... })`) so the RLS WITH CHECK policy admits the row.
   */
  createForTenant(tenantId: string, input: NewTrackData): Promise<TrackInfoRow>;
}

export function createTracksRepository(db: RawDb): TracksRepository {
  return {
    // No ORDER BY: preserves the existing /api/tracks ordering (the route reassigns
    // sequential ids by row position). Add deliberate sorting as a separate change.
    async listAll() {
      return db.query<TrackInfoRow>({ text: 'SELECT * FROM meekah.track_info', values: [] });
    },

    async listByTenant(tenantId) {
      return db.query<TrackInfoRow>({
        text: 'SELECT * FROM meekah.track_info WHERE tenant_id = $1',
        values: [tenantId],
      });
    },

    async createForTenant(tenantId, input) {
      // Legacy table: `id` is a plain integer PK with no sequence, so allocate MAX+1 inline.
      // A concurrent-insert collision surfaces as a 23505 the service maps to Conflict.
      const row = await db.queryOne<TrackInfoRow>({
        text: `INSERT INTO meekah.track_info
                 (id, tenant_id, track_catalog, track_title, track_producer,
                  release, duration, bpm, note, scale)
               SELECT COALESCE(MAX(id), 0) + 1, $1, $2, $3, $4, $5, $6, $7, $8, $9
               FROM meekah.track_info
               RETURNING *`,
        values: [
          tenantId,
          input.catalog,
          input.title,
          input.producer ?? null,
          input.release ?? null,
          input.duration ?? null,
          input.bpm ?? null,
          input.note ?? null,
          input.scale ?? null,
        ],
      });
      if (!row) throw new Error('Failed to create track');
      return row;
    },
  };
}
