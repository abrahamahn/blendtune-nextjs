// src/shared/validation/track.test.ts
import { parseNewTrack } from './track';

describe('parseNewTrack', () => {
  it('accepts a minimal valid payload and normalizes the catalog id', () => {
    const result = parseNewTrack({ catalog: ' MKH063 ', title: '  Playa  ' });
    expect(result).toEqual({ ok: true, data: { catalog: 'mkh063', title: 'Playa' } });
  });

  it('accepts a full payload with coerced bpm', () => {
    const result = parseNewTrack({
      catalog: 'mkh064',
      title: 'Night Drive',
      producer: 'Meekah',
      release: '2026-07-06',
      duration: '3:44',
      bpm: '140',
      note: 'C',
      scale: 'minor',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.bpm).toBe(140);
      expect(result.data.release).toBe('2026-07-06');
    }
  });

  it('rejects a non-object payload', () => {
    expect(parseNewTrack(null)).toEqual({ ok: false, errors: { input: expect.any(String) } });
    expect(parseNewTrack('x').ok).toBe(false);
  });

  it('requires catalog and title', () => {
    const result = parseNewTrack({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(['catalog', 'title']);
    }
  });

  it.each([
    ['catalog', { catalog: 'x!', title: 'T' }],
    ['release', { catalog: 'ok1', title: 'T', release: 'July 6' }],
    ['duration', { catalog: 'ok1', title: 'T', duration: '3m44s' }],
    ['bpm', { catalog: 'ok1', title: 'T', bpm: 12.5 }],
    ['bpm', { catalog: 'ok1', title: 'T', bpm: 1000 }],
  ])('rejects an invalid %s', (field, payload) => {
    const result = parseNewTrack(payload);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[field]).toBeDefined();
  });

  it('treats empty strings as absent optional fields', () => {
    const result = parseNewTrack({ catalog: 'ok1', title: 'T', producer: '', bpm: '' });
    expect(result).toEqual({ ok: true, data: { catalog: 'ok1', title: 'T' } });
  });
});
