// main/apps/web/src/client/features/player/components/PlayerControls.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faForwardStep, faRepeat } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@ui';
import { PlayButton } from '@client/components';
import { usePlayer } from '@client/features/player/services/playerService';
import { usePlayerControls } from '../hooks';

import './player.css';

const PlayerControls: React.FC = () => {
  const { isPlaying, loopMode } = usePlayer();
  const { togglePlayPause, previousTrack, nextTrack, loopTrack } = usePlayerControls();

  return (
    <div className="bt-player-controls">
      <Button
        variant="text"
        size="inline"
        className="bt-player-icon-btn"
        onClick={previousTrack}
        aria-label="Previous track"
      >
        <FontAwesomeIcon icon={faBackwardStep} />
      </Button>
      <PlayButton playing={isPlaying} size="md" onClick={togglePlayPause} />
      <Button
        variant="text"
        size="inline"
        className="bt-player-icon-btn"
        onClick={nextTrack}
        aria-label="Next track"
      >
        <FontAwesomeIcon icon={faForwardStep} />
      </Button>
      <Button
        variant="text"
        size="inline"
        className="bt-player-icon-btn"
        data-active={loopMode !== 'off'}
        onClick={loopTrack}
        aria-label={`Loop mode: ${loopMode}`}
      >
        <FontAwesomeIcon icon={faRepeat} size="sm" />
        {loopMode !== 'off' && (
          <span className="bt-player-loop-badge">{loopMode === 'one' ? '1' : 'all'}</span>
        )}
      </Button>
    </div>
  );
};

export default PlayerControls;
