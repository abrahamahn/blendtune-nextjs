// main/apps/web/src/client/components/track/trackDisplay.ts
// Pure Track → display-prop mapping shared by TrackRow and TrackCard.
import type { Track } from '@/shared/types/track';

const ARTWORK_CDN = 'https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork';

/** Returns the value when it carries information; catalog uses "n/a" and "" as null. */
export function present(value: string | null | undefined): string | undefined {
  return value != null && value !== '' && value !== 'n/a' ? value : undefined;
}

export interface TrackFacts {
  note?: string;
  scale?: string;
  bpm?: string;
  duration?: string;
}

/** Musical facts for the readout: key note/scale, BPM, duration. */
export function trackFacts(track: Track): TrackFacts {
  return {
    note: present(track.info.key.note),
    scale: present(track.info.key.scale),
    bpm: present(track.info.bpm),
    duration: present(track.info.duration),
  };
}

/** At most three quiet mood tags (design direction: "moods become at most three quiet tags"). */
export function trackTags(track: Track): string[] {
  return track.info.mood.map(present).filter((mood): mood is string => mood != null).slice(0, 3);
}

/** Artwork URL: explicit imageUrl wins, then the catalog-derived CDN path. */
export function artworkSrc(track: Track): string | undefined {
  if (present(track.imageUrl) != null) return track.imageUrl;
  const catalog = present(track.metadata.catalog);
  return catalog != null ? `${ARTWORK_CDN}/${catalog}.jpg` : undefined;
}
