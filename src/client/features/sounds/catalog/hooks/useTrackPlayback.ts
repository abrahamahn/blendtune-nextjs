// src\client\features\sounds\catalog\hooks\useTrackPlayback.ts

import { useCallback } from 'react';
import { Track } from "@/shared/types/track";
import { usePlayer } from "@player/services/playerService";
import { useRightSidebar } from "@layout/rightbar/context";

/**
 * Hook for handling track playback with integrated sidebar behavior
 * 
 * Centralizes the logic for playing tracks and managing the sidebar state
 * based on track selection.
 */
export default function useTrackPlayback() {
  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { openSidebar, userClosedSidebar } = useRightSidebar();
  
  /**
   * Plays a track and handles sidebar visibility
   */
  const handleTrackPlay = useCallback((track: Track) => {
    playTrack(track);
    
    // Open sidebar if user hasn't explicitly closed it
    if (!userClosedSidebar) {
      openSidebar();
    }
  }, [playTrack, openSidebar, userClosedSidebar]);
  
  return {
    currentTrack,
    isPlaying,
    handleTrackPlay
  };
}