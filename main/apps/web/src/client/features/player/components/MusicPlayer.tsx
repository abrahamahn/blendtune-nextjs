// main/apps/web/src/client/features/player/components/MusicPlayer.tsx
/**
 * Persistent bottom player: desktop bar + mobile bar sharing one expanded
 * details panel (the panel replaced the old right sidebar). Playback logic
 * lives in playerService and the player hooks — this file is presentation.
 */
import React, { Suspense, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@ui';
import { useKeyboardShortcuts, useVolumeControl } from '../hooks';
import { usePlayer } from '@client/features/player/services/playerService';
import { useTracks } from '@client/features/tracks';
import { useNowPlaying } from '@features/layout/rightbar';

import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import TrackInfo from './TrackInfo';
import TrackProgress from './TrackProgress';
import MobilePlayer from './MobilePlayer';
import MusicPlayerSkeleton from './MusicPlayerSkeleton';
import PlayerDetails from './PlayerDetails';

import './player.css';

const MusicPlayer: React.FC = () => {
  const { isLoading } = useTracks();
  const { currentTrack, isPlaying } = usePlayer();
  const { isOpen: nowPlayingOpen, toggle: toggleNowPlaying } = useNowPlaying();
  const [detailsOpen, setDetailsOpen] = useState(false);

  useKeyboardShortcuts();
  const { handleVolumeWheel } = useVolumeControl();

  const toggleDetails = () => setDetailsOpen((prev) => !prev);

  if (isLoading) {
    return <MusicPlayerSkeleton />;
  }

  return (
    <div className="bt-player" onWheelCapture={handleVolumeWheel}>
      {detailsOpen && currentTrack != null && (
        <PlayerDetails track={currentTrack} playing={isPlaying} onClose={toggleDetails} />
      )}

      <div className="bt-player-bar">
        <PlayerControls />
        <div className="bt-player-progress">
          <Suspense fallback={null}>
            <TrackProgress />
            <VolumeControl />
          </Suspense>
        </div>
        <TrackInfo detailsOpen={detailsOpen} onToggleDetails={toggleDetails} />
        <Button
          variant="text"
          size="inline"
          className={`bt-player-queue-btn${nowPlayingOpen ? ' bt-player-queue-btn-active' : ''}`}
          onClick={toggleNowPlaying}
          aria-label="Toggle now playing"
          aria-pressed={nowPlayingOpen}
        >
          <FontAwesomeIcon icon={faBarsStaggered} />
        </Button>
      </div>

      <MobilePlayer detailsOpen={detailsOpen} onToggleDetails={toggleDetails} />
    </div>
  );
};

export default MusicPlayer;
