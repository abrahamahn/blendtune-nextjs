// main/apps/web/src/client/components/track/FactsReadout.test.ts
import { formatFacts } from './FactsReadout';

describe('formatFacts', () => {
  it('renders all facts with · separators', () => {
    expect(formatFacts({ note: 'C', scale: 'Minor', bpm: '98', duration: '3:42' })).toBe(
      'Cmin · 98 · 3:42',
    );
  });

  it('composes the key from note + first three letters of the scale, lowercased', () => {
    expect(formatFacts({ note: 'F#', scale: 'Major' })).toBe('F#maj');
  });

  it('renders the note alone when the scale is missing', () => {
    expect(formatFacts({ note: 'A', bpm: '140' })).toBe('A · 140');
  });

  it('skips the key entirely when the note is missing, even if the scale is present', () => {
    expect(formatFacts({ scale: 'Minor', bpm: '98', duration: '3:42' })).toBe('98 · 3:42');
  });

  it('skips missing facts without dangling separators', () => {
    expect(formatFacts({ note: 'C', scale: 'Minor', duration: '3:42' })).toBe('Cmin · 3:42');
    expect(formatFacts({ bpm: '120' })).toBe('120');
  });

  it('treats "n/a" and empty strings as missing', () => {
    expect(formatFacts({ note: 'n/a', scale: 'Minor', bpm: '', duration: '2:10' })).toBe('2:10');
  });

  it('returns an empty string when nothing is present', () => {
    expect(formatFacts({})).toBe('');
  });
});
