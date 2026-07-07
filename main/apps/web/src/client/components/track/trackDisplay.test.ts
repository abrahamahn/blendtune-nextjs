// main/apps/web/src/client/components/track/trackDisplay.test.ts
import { artworkSrc, present, trackFacts, trackTags } from './trackDisplay';

import type { Track } from '@/shared/types/track';

function makeTrack(overrides: { catalog?: string; imageUrl?: string; mood?: string[] } = {}): Track {
  return {
    id: 1,
    file: 'beat.mp3',
    ...(overrides.imageUrl != null && { imageUrl: overrides.imageUrl }),
    metadata: {
      catalog: overrides.catalog ?? 'BT-001',
      isrc: '',
      iswc: '',
      title: 'PLAYA',
      release: '',
      album: '',
      track: '',
      producer: 'Blendtune',
    },
    info: {
      duration: '3:42',
      bpm: '98',
      key: { note: 'C', scale: 'Minor' },
      genre: [{ maingenre: 'Reggaeton', subgenre: '' }],
      relatedartist: ['Bad Bunny'],
      mood: overrides.mood ?? ['Dark', 'Bouncy', 'Late-night', 'Extra'],
      tag: [],
    },
    arrangement: [],
    instruments: [],
    sample: { file: '', samplepack: '', author: '', clearance: '' },
    creator: [],
    exclusive: { artistname: '', email: '', phone: '', address: '', management: '' },
  };
}

describe('present', () => {
  it('passes real values and nulls out "", "n/a", null, undefined', () => {
    expect(present('C')).toBe('C');
    expect(present('')).toBeUndefined();
    expect(present('n/a')).toBeUndefined();
    expect(present(null)).toBeUndefined();
    expect(present(undefined)).toBeUndefined();
  });
});

describe('trackFacts', () => {
  it('extracts key note/scale, bpm, and duration', () => {
    expect(trackFacts(makeTrack())).toEqual({
      note: 'C',
      scale: 'Minor',
      bpm: '98',
      duration: '3:42',
    });
  });
});

describe('trackTags', () => {
  it('returns at most three moods', () => {
    expect(trackTags(makeTrack())).toEqual(['Dark', 'Bouncy', 'Late-night']);
  });

  it('filters "n/a" and empty moods before capping', () => {
    expect(trackTags(makeTrack({ mood: ['n/a', 'Dark', '', 'Moody', 'Warm'] }))).toEqual([
      'Dark',
      'Moody',
      'Warm',
    ]);
  });
});

describe('artworkSrc', () => {
  it('prefers an explicit imageUrl', () => {
    expect(artworkSrc(makeTrack({ imageUrl: 'https://cdn.example/x.jpg' }))).toBe(
      'https://cdn.example/x.jpg',
    );
  });

  it('derives the CDN URL from the catalog', () => {
    expect(artworkSrc(makeTrack())).toBe(
      'https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/BT-001.jpg',
    );
  });

  it('returns undefined when neither is present, so Artwork shows the monogram', () => {
    expect(artworkSrc(makeTrack({ catalog: '' }))).toBeUndefined();
  });
});
