// main/apps/web/src/client/components/track/TrackCard.tsx
// Card variant for carousels: artwork on top, title/producer, facts readout.
import { Text } from '@ui';

import { PlayButton } from '../player/PlayButton';

import { Artwork } from './Artwork';
import { FactsReadout } from './FactsReadout';
import { artworkSrc, present, trackFacts } from './trackDisplay';

import './TrackCard.css';

import type { Track } from '@/shared/types/track';

export interface TrackCardProps {
  track: Track;
  /** Whether this card's track is playing (surface highlight + readout glow) */
  playing?: boolean;
  onPlay?: () => void;
}

export function TrackCard({ track, playing = false, onPlay }: TrackCardProps) {
  const { note, scale, bpm, duration } = trackFacts(track);
  const producer = present(track.metadata.producer);

  return (
    <div className="bt-track-card" data-playing={playing}>
      <span className="bt-track-card-art">
        <Artwork src={artworkSrc(track)} alt={track.metadata.title} />
        {onPlay != null && (
          <PlayButton playing={playing} size="md" onClick={onPlay} className="bt-track-card-play" />
        )}
      </span>
      <Text as="span" className="bt-track-card-title">
        {track.metadata.title}
      </Text>
      {producer != null && (
        <Text as="span" size="xs" tone="muted" className="bt-track-card-producer">
          {producer}
        </Text>
      )}
      <FactsReadout
        note={note}
        scale={scale}
        bpm={bpm}
        duration={duration}
        playing={playing}
        className="bt-track-card-readout"
      />
    </div>
  );
}
