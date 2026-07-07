// main/apps/web/src/client/features/player/components/TrackInfo.tsx
/**
 * Current-track cluster in the player bar: artwork, title, facts readout.
 * The title toggles the expanded details panel (the old right sidebar's job).
 */
import React from 'react';

import { Button, Text } from '@ui';
import { Artwork, FactsReadout, artworkSrc, trackFacts } from '@client/components';
import { usePlayer } from '@client/features/player/services/playerService';

import './player.css';

interface TrackInfoProps {
  detailsOpen: boolean;
  onToggleDetails: () => void;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ detailsOpen, onToggleDetails }) => {
  const { currentTrack, isPlaying } = usePlayer();

  if (!currentTrack) {
    return (
      <div className="bt-player-info">
        <Text as="span" className="bt-player-empty">
          No track selected
        </Text>
      </div>
    );
  }

  const { note, scale, bpm, duration } = trackFacts(currentTrack);

  return (
    <div className="bt-player-info">
      <span className="bt-player-info-art">
        <Artwork src={artworkSrc(currentTrack)} alt={currentTrack.metadata.title} />
      </span>
      <div className="bt-player-info-id">
        <Button
          variant="text"
          size="inline"
          className="bt-player-info-title"
          onClick={onToggleDetails}
          aria-expanded={detailsOpen}
          aria-label={detailsOpen ? 'Hide track details' : 'Show track details'}
        >
          {currentTrack.metadata.title}
        </Button>
        <FactsReadout note={note} scale={scale} bpm={bpm} duration={duration} playing={isPlaying} />
      </div>
    </div>
  );
};

export default TrackInfo;
