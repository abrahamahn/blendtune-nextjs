// main/apps/web/src/client/features/sounds/catalog/hooks/useTrackPlayback.ts
import { useCallback } from 'react';

import { usePlayer } from '@features/player/services/playerService';

import type { Track } from '@/shared/types/track';

/** Centralizes track playback handling for the catalog surfaces. */
export default function useTrackPlayback() {
  const { currentTrack, isPlaying, playTrack } = usePlayer();

  const handleTrackPlay = useCallback((track: Track) => playTrack(track), [playTrack]);

  return {
    currentTrack,
    isPlaying,
    handleTrackPlay,
  };
}
