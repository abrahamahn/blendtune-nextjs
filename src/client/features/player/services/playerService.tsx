/**
 * @fileoverview Updated PlayerProvider using the AudioService abstraction
 * @module features/player/services/playerService
 */

"use client";
import React, { 
  createContext, 
  useContext, 
  useReducer, 
  ReactNode, 
  useEffect, 
  useState, 
  useCallback 
} from 'react';
import { Track } from '@/shared/types/track';
import { PlayerContextType } from '../types/player';
import { playerReducer, initialPlayerState } from '../context/playerReducer';
import { playerActions } from '../context/playerActions';
import { storePlaybackTime, getPlaybackTime, resetPlaybackTime } from '../utils/storage';
import { useTracks } from "@/client/features/tracks";
import { useAudioElement, AudioEventHandlers } from './audioService';

// Create the context for player state and methods
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

/**
 * Player Provider component
 * Manages all player-related state, audio playback, and provides context methods
 * Uses the new AudioService abstraction
 */
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize player state and dispatch
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const { tracks, setCurrentTrack: setTrackInTracksContext } = useTracks();
  
  // Track end handler to prevent circular dependencies
  const [trackEndHandler, setTrackEndHandler] = useState<() => void>(() => () => {});
  
  // Define audio event handlers
  const audioEventHandlers: AudioEventHandlers = {
    onEnded: () => trackEndHandler(),
    onTimeUpdate: (currentTime) => {
      dispatch(playerActions.setCurrentTime(currentTime));
      if (state.currentTrack?.id) {
        storePlaybackTime(state.currentTrack.id, currentTime);
      }
    },
    onDurationChange: (duration) => {
      dispatch(playerActions.setTrackDuration(duration));
    },
    onPlay: () => {
      dispatch(playerActions.setIsPlaying(true));
    },
    onPause: () => {
      dispatch(playerActions.setIsPlaying(false));
    },
    onVolumeChange: (volume) => {
      dispatch(playerActions.setVolume(volume));
    },
    onError: (error) => {
      console.error("Audio playback error:", error);
    },
    onLoaded: () => {
      // Restore saved time if available
      if (state.currentTrack?.id) {
        const savedTime = getPlaybackTime(state.currentTrack.id);
        if (savedTime > 0 && savedTime < audio.duration) {
          audio.seekTo(savedTime);
        }
      }
      
      // Autoplay
      audio.play().catch(error => console.error("Error playing track:", error));
    }
  };
  
  // Initialize audio service with handlers
  const audio = useAudioElement('', state.volume, audioEventHandlers);

  // Add this effect to initialize tracks
  useEffect(() => {
    if (tracks.length > 0 && !state.currentTrack) {
      // Set the first track
      dispatch(playerActions.setCurrentTrack(tracks[0]));
      dispatch(playerActions.setTrackList(tracks));
    }
  }, [tracks, state.currentTrack]);

  /**
   * Set current track in player state
   * @param track Track to be set as current
   */
  const setCurrentTrack = useCallback((track: Track | undefined) => {
    // Update track in player context
    dispatch(playerActions.setCurrentTrack(track));
    
    // Also update track in tracks context to keep both contexts in sync
    setTrackInTracksContext(track);
    
    // Load track audio
    if (track?.file) {
      const newSrc = `/audio/tracks/${track.file}`;
      dispatch(playerActions.setSharedAudioUrl(newSrc));
      audio.loadTrack(newSrc);
    }
  }, [audio, setTrackInTracksContext]);

  /**
   * Update track list in player state
   * @param tracks Array of tracks to set
   */
  const setTrackList = useCallback((tracks: Track[]) => {
    dispatch(playerActions.setTrackList(tracks));
  }, []);

  /**
   * Toggle play/pause for current track
   */
  const togglePlay = useCallback(() => {
    audio.toggle().catch(error => {
      console.error("Error toggling playback:", error);
    });
  }, [audio]);

  /**
   * Set volume level
   * @param volume Volume level between 0 and 1
   */
  const setVolume = useCallback((volume: number) => {
    audio.setVolume(volume);
  }, [audio]);

  /**
   * Seek to a specific time in the track
   * @param time Time to seek to in seconds
   */
  const seekTo = useCallback((time: number) => {
    audio.seekTo(time);
  }, [audio]);

  // Effect: Update track source when current track changes
  useEffect(() => {
    if (!state.currentTrack?.file) return;
    
    const newSrc = `/audio/tracks/${state.currentTrack.file}`;
    dispatch(playerActions.setSharedAudioUrl(newSrc));
    audio.loadTrack(newSrc);
  }, [state.currentTrack, audio]);

  // Combine all context values and methods
  const contextValue: PlayerContextType = {
    ...state,
    audioRef: audio.audioRef,
    dispatch,
    setCurrentTrack,
    setTrackList,
    togglePlay,
    setVolume,
    seekTo,
    setTrackEndHandler
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
      {/* Audio element is now managed by the useAudioElement hook */}
    </PlayerContext.Provider>
  );
};

/**
 * Custom hook for accessing player context
 * Provides a convenient way to consume player state and methods
 * @throws {Error} If used outside of PlayerProvider
 * @returns {PlayerContextType} Player context with state and methods
 */
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

// Re-export actions for convenience
export { playerActions } from '../context/playerActions';