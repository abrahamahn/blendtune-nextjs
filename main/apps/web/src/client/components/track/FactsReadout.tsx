// main/apps/web/src/client/components/track/FactsReadout.tsx
// The signature element: LED-style mono readout of a track's musical facts,
// e.g. `Cmin · 98 · 3:42`. Glows amber (via .bt-readout) while the track plays.
import { present } from './trackDisplay';

export interface FactsReadoutProps {
  /** Key note, e.g. "C" */
  note?: string;
  /** Key scale, e.g. "Minor" — rendered as its first three letters ("min") */
  scale?: string;
  /** Tempo, e.g. "98" */
  bpm?: string;
  /** Duration, e.g. "3:42" */
  duration?: string;
  /** Whether the track is currently playing (amber glow) */
  playing?: boolean;
  className?: string;
}

/** Composes `note + scale` into the compact key form: C + Minor → "Cmin". */
function formatKey(note?: string, scale?: string): string | undefined {
  const keyNote = present(note);
  if (keyNote == null) return undefined;
  const keyScale = present(scale);
  return keyScale != null ? `${keyNote}${keyScale.slice(0, 3).toLowerCase()}` : keyNote;
}

/** Joins the present facts with `·` separators, skipping missing ones. */
export function formatFacts({ note, scale, bpm, duration }: FactsReadoutProps): string {
  return [formatKey(note, scale), present(bpm), present(duration)]
    .filter((fact): fact is string => fact != null)
    .join(' · ');
}

export function FactsReadout(props: FactsReadoutProps) {
  const facts = formatFacts(props);
  if (facts === '') return null;
  return (
    <span
      className={`bt-readout ${props.className ?? ''}`.trim()}
      data-playing={props.playing === true}
    >
      {facts}
    </span>
  );
}
