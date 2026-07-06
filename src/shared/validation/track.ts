// src/shared/validation/track.ts
/**
 * New-track input validation (framework-agnostic, no dependencies).
 *
 * Shared between the creator API (server-side gate) and the Phase 6 creator dashboard form
 * (client-side pre-submit). Hand-rolled rather than zod to keep shared/ dependency-free;
 * the shape mirrors zod's safeParse result so a later swap is mechanical.
 */

/** Validated payload for creating a track's catalog metadata. */
export interface NewTrackData {
  /** Catalog id, unique across the marketplace (e.g. "mkh063"). */
  catalog: string;
  title: string;
  producer?: string;
  /** Release date, YYYY-MM-DD. */
  release?: string;
  /** Duration as stored, e.g. "3:44". */
  duration?: string;
  bpm?: number;
  note?: string;
  scale?: string;
}

export type ParseTrackResult =
  | { ok: true; data: NewTrackData }
  | { ok: false; errors: Record<string, string> };

const CATALOG_PATTERN = /^[a-z0-9][a-z0-9_-]{1,31}$/;
const RELEASE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DURATION_PATTERN = /^\d{1,2}:\d{2}$/;

const optionalText = (
  value: unknown,
  field: string,
  errors: Record<string, string>,
  maxLength = 200,
): string | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) {
    errors[field] = `${field} must be a non-empty string of at most ${maxLength} characters`;
    return undefined;
  }
  return value.trim();
};

/** Validate an untrusted new-track payload. Never throws. */
export function parseNewTrack(input: unknown): ParseTrackResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, errors: { input: 'Expected a JSON object' } };
  }

  const raw = input as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const catalog = typeof raw.catalog === 'string' ? raw.catalog.trim().toLowerCase() : '';
  if (!CATALOG_PATTERN.test(catalog)) {
    errors.catalog =
      'catalog is required: 2-32 chars, lowercase letters/digits/hyphen/underscore';
  }

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (title.length === 0 || title.length > 200) {
    errors.title = 'title is required (at most 200 characters)';
  }

  const producer = optionalText(raw.producer, 'producer', errors, 100);
  const note = optionalText(raw.note, 'note', errors, 10);
  const scale = optionalText(raw.scale, 'scale', errors, 20);

  const release = optionalText(raw.release, 'release', errors, 10);
  if (release !== undefined && !RELEASE_PATTERN.test(release)) {
    errors.release = 'release must be a YYYY-MM-DD date';
  }

  const duration = optionalText(raw.duration, 'duration', errors, 8);
  if (duration !== undefined && !DURATION_PATTERN.test(duration)) {
    errors.duration = 'duration must look like m:ss';
  }

  let bpm: number | undefined;
  if (raw.bpm !== undefined && raw.bpm !== null && raw.bpm !== '') {
    bpm = typeof raw.bpm === 'number' ? raw.bpm : Number(raw.bpm);
    if (!Number.isInteger(bpm) || bpm < 1 || bpm > 999) {
      errors.bpm = 'bpm must be an integer between 1 and 999';
      bpm = undefined;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { catalog, title, producer, release, duration, bpm, note, scale } };
}
