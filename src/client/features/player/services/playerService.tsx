
// src\client\features\player\services\playerService.tsx
/**
 * @fileoverview Centralized context for music player state management
 * @module features/player/services/playerService
 */

"use client";
import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useRef, 
  ReactNode, 
  useEffect, 
  useState, 
  useCallback 
} from 'react';
import { Track } from '@/shared/types/track';
import { PlayerContextType } from '../context/playerTypes';
import { playerReducer, initialPlayerState } from '../context/playerReducer';
import { playerActions } from '../context/playerActions';
import { storePlaybackTime, getPlaybackTime } from '../utils/storage';
import { useTracks } from "@/client/features/tracks";

// Create the context for player state and methods
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

/**
 * Player Provider component
 * Manages all player-related state, audio playback, and provides context methods
 */
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize player state and dispatch
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  
  // Reference to HTML audio element
  const audioRef = useRef<HTMLAudioElement>(null!);
  const { tracks } = useTracks();

  // Track end handler to prevent circular dependencies
  const [trackEndHandler, setTrackEndHandler] = useState<() => void>(() => () => {});

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
    dispatch(playerActions.setCurrentTrack(track));
  }, []);

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
    if (!audioRef.current) return;

    if (state.isPlaying) {
      audioRef.current.pause();
      dispatch(playerActions.setIsPlaying(false));
    } else {
      audioRef.current.play().catch(console.error);
      dispatch(playerActions.setIsPlaying(true));
    }
  }, [state.isPlaying]);

  /**
   * Set volume level
   * @param volume Volume level between 0 and 1
   */
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      dispatch(playerActions.setVolume(volume));
    }
  }, []);

  /**
   * Seek to a specific time in the track
   * @param time Time to seek to in seconds
   */
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch(playerActions.setCurrentTime(time));
    }
  }, []);

  // Effect: Update audio source when current track changes
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack) return;
    
    const audioElement = audioRef.current;
    const newSrc = `/audio/tracks/${state.currentTrack.file}`;
    
    // Update shared audio URL
    dispatch(playerActions.setSharedAudioUrl(newSrc));
  
    // Reset and load new audio source
    audioElement.pause();
    audioElement.src = newSrc;
    audioElement.load();
  
    // Handle metadata loading and autoplay
    const handleLoadedData = () => {
      // Update track duration
      if (audioElement.duration && !isNaN(audioElement.duration)) {
        dispatch(playerActions.setTrackDuration(audioElement.duration));
      }
      
      audioElement
        .play()
        .catch((error) => console.error("Error Playing:", error));
      dispatch(playerActions.setIsPlaying(true));
    };
  
    audioElement.addEventListener("loadeddata", handleLoadedData, { once: true });
  
    return () => {
      audioElement.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [state.currentTrack]);

  // Effect: Restore playback position
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack?.id) return;
    
    const audioEl = audioRef.current;
    const trackId = state.currentTrack.id;
    const savedTime = getPlaybackTime(trackId);
    
    if (savedTime <= 0) return;
    
    const handleLoadedData = () => {
      if (savedTime >= audioEl.duration) return;
      audioEl.currentTime = savedTime;
    };
    
    audioEl.addEventListener("loadeddata", handleLoadedData, { once: true });
    return () => {
      audioEl.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [state.currentTrack]);

  // Combine all context values and methods
  const contextValue: PlayerContextType = {
    ...state,
    audioRef,
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
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={trackEndHandler}
        onPause={() => dispatch(playerActions.setIsPlaying(false))}
        onPlay={() => dispatch(playerActions.setIsPlaying(true))}
        onTimeUpdate={() => {
          if (!audioRef.current || !state.currentTrack?.id) return;
          const time = audioRef.current.currentTime;
          dispatch(playerActions.setCurrentTime(time));
          storePlaybackTime(state.currentTrack.id, time);
        }}
        preload="none"
      />
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