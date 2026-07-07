// main/apps/web/src/client/features/sounds/catalog/layouts/NewTracks.tsx
// Horizontal new-tracks carousel built on the TrackCard composite.
import React from 'react';

import { TrackCard, TrackCardSkeleton } from '@client/components';
import { useTracks } from '@client/features/tracks';
import { usePlayer } from '@features/player/services/playerService';
import useTrackPlayback from '@client/features/sounds/catalog/hooks/useTrackPlayback';

import './NewTracks.css';

const SKELETON_CARDS = 6;
const CAROUSEL_SIZE = 12;

/** Newest tracks in a scroll-snap carousel of TrackCards. */
const NewTracks: React.FC = () => {
  const { tracks, isLoading } = useTracks();
  const { currentTrack, isPlaying } = usePlayer();
  const { handleTrackPlay } = useTrackPlayback();

  return (
    <div className="bt-new-tracks">
      {isLoading
        ? Array.from({ length: SKELETON_CARDS }).map((_, index) => (
            <TrackCardSkeleton key={index} />
          ))
        : tracks.slice(0, CAROUSEL_SIZE).map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              playing={isPlaying && currentTrack?.id === track.id}
              onPlay={() => handleTrackPlay(track)}
            />
          ))}
    </div>
  );
};

export default NewTracks;
