// main/apps/web/src/client/components/track/TrackRow.tsx
// Catalog row per the design-direction grammar:
// artwork │ TITLE + producer │ facts readout │ ≤3 muted tags │ hover actions.
import { Text } from '@ui';

import { PlayButton } from '../player/PlayButton';

import { Artwork } from './Artwork';
import { FactsReadout } from './FactsReadout';
import { Tag } from './Tag';
import { artworkSrc, present, trackFacts, trackTags } from './trackDisplay';

import './TrackRow.css';

import type { Track } from '@/shared/types/track';
import type { ReactNode } from 'react';

export interface TrackRowProps {
  track: Track;
  /** Whether this row's track is playing (row highlight + readout glow) */
  playing?: boolean;
  onPlay?: () => void;
  /** Actions slot, revealed on hover (Save, Use this beat, …) */
  children?: ReactNode;
}

export function TrackRow({ track, playing = false, onPlay, children }: TrackRowProps) {
  const { note, scale, bpm, duration } = trackFacts(track);
  const tags = trackTags(track);
  const producer = present(track.metadata.producer);

  return (
    <div className="bt-track-row" data-playing={playing}>
      <span className="bt-track-row-art">
        <Artwork src={artworkSrc(track)} alt={track.metadata.title} />
        {onPlay != null && (
          <PlayButton playing={playing} size="sm" onClick={onPlay} className="bt-track-row-play" />
        )}
      </span>
      <span className="bt-track-row-id">
        <Text as="span" className="bt-track-row-title">
          {track.metadata.title}
        </Text>
        {producer != null && (
          <Text as="span" size="xs" tone="muted" className="bt-track-row-producer">
            {producer}
          </Text>
        )}
      </span>
      <FactsReadout note={note} scale={scale} bpm={bpm} duration={duration} playing={playing} />
      {tags.length > 0 && (
        <span className="bt-track-row-tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </span>
      )}
      {children != null && <span className="bt-track-row-actions">{children}</span>}
    </div>
  );
}
