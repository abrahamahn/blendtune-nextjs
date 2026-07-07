// main/apps/web/src/client/features/player/components/MobilePlayer.tsx
/**
 * Compact player bar for mobile: progress strip, artwork, title (toggles the
 * details panel), facts readout, and play/next controls.
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep } from '@fortawesome/free-solid-svg-icons';

import { Button, Text } from '@ui';
import { Artwork, FactsReadout, PlayButton, artworkSrc, present, trackFacts } from '@client/components';
import { usePlayer } from '@client/features/player/services/playerService';
import { usePlayerControls } from '../hooks';
import { useProgressControl } from '../hooks/useProgressControl';

import './player.css';

interface MobilePlayerProps {
  detailsOpen: boolean;
  onToggleDetails: () => void;
}

const MobilePlayer: React.FC<MobilePlayerProps> = ({ detailsOpen, onToggleDetails }) => {
  const { currentTrack, isPlaying } = usePlayer();
  const { togglePlayPause, nextTrack } = usePlayerControls();
  const { handleProgressClick, progressPercent } = useProgressControl();

  if (!currentTrack) {
    return null;
  }

  const { note, scale, bpm } = trackFacts(currentTrack);
  const producer = present(currentTrack.metadata.producer);

  return (
    <div className="bt-player-mobile">
      <div
        className="bt-player-mobile-track"
        onClick={handleProgressClick}
        role="progressbar"
        aria-label="Track progress"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="bt-player-mobile-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="bt-player-mobile-row">
        <span className="bt-player-mobile-art">
          <Artwork src={artworkSrc(currentTrack)} alt={currentTrack.metadata.title} />
        </span>
        <div className="bt-player-mobile-id">
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
          {producer != null && (
            <Text as="span" size="xs" tone="muted">
              {producer}
            </Text>
          )}
        </div>
        <FactsReadout note={note} scale={scale} bpm={bpm} playing={isPlaying} />
        <PlayButton playing={isPlaying} size="sm" onClick={togglePlayPause} />
        <Button
          variant="text"
          size="inline"
          className="bt-player-icon-btn"
          onClick={nextTrack}
          aria-label="Next track"
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </Button>
      </div>
    </div>
  );
};

export default MobilePlayer;
