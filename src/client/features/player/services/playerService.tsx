// src/client/features/player/services/playerService.tsx
/**
 * @fileoverview Final PlayerProvider with flexible playback control and robust error handling.
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
  useCallback,
  useRef,
  useMemo,
  RefObject,
  Dispatch,
} from 'react';
import { Track } from '@/shared/types/track';
import { playerReducer, initialPlayerState } from '../context/playerReducer';
import { playerActions } from '../context/playerActions';
import { storePlaybackTime, getPlaybackTime } from '../utils/storage';
import { useTracks } from "@/client/features/tracks";
import { useAudioElement, AudioEventHandlers } from '../services/audioService';
import { PlayerContextType, PlayerAction } from '../types/contextType';

// Define the context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

/**
 * A stub for logging playback errors to analytics.
 * In a real application, replace this with your analytics logging implementation.
 */
const logPlaybackError = (error: Error, trackId?: number) => {
  console.error(`Analytics log - Playback error for track ${trackId}:`, error);
};

/**
 * Robust error handling function for playback errors.
 * Categorizes the error, dispatches an error state, and logs it for analytics.
 */
const handlePlaybackError = (
  error: Error,
  dispatch: Dispatch<PlayerAction>,
  trackId?: number
) => {
  if (error.name === 'NotAllowedError') {
    dispatch(
      playerActions.setPlaybackError({
        type: 'permission',
        message: 'Playback requires user interaction first',
        recoverable: true,
      })
    );
  } else if (error.name === 'NotSupportedError') {
    dispatch(
      playerActions.setPlaybackError({
        type: 'format',
        message: 'Audio format not supported by your browser',
        recoverable: false,
      })
    );
  } else {
    dispatch(
      playerActions.setPlaybackError({
        type: 'unknown',
        message: `Playback error: ${error.message}`,
        recoverable: true,
      })
    );
  }
  logPlaybackError(error, trackId);
};

/**
 * Player Provider component that manages playback state and control functions.
 * It also memoizes the context value to prevent unnecessary re-renders of context consumers.
 */
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize player state and dispatch using a reducer
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const { tracks } = useTracks();

  // Add this at the top of your PlayerProvider component
  console.log('🎵 PlayerProvider rendering, tracks:', tracks.length);
  console.log('🎵 Current track:', state.currentTrack?.metadata?.title);
  // State for handling track end events to avoid circular dependencies
  const [trackEndHandler, setTrackEndHandler] = useState<() => void>(() => () => {});

  // Ref to track initialization status (one-time setup)
  const isInitializedRef = useRef(false);

  // Ref to store the previous track to detect changes
  const prevTrackRef = useRef<Track | undefined>(undefined);

  // Ref flag to determine if auto-play should occur on track load
  const shouldAutoPlayRef = useRef(false);

  // Define audio event handlers with improved error handling
  const audioEventHandlers: AudioEventHandlers = {
    onEnded: () => trackEndHandler(),
    onTimeUpdate: (currentTime: number) => {
      dispatch(playerActions.setCurrentTime(currentTime));
      if (state.currentTrack?.id) {
        storePlaybackTime(state.currentTrack.id, currentTime);
      }
    },
    onDurationChange: (duration: number) => {
      dispatch(playerActions.setTrackDuration(duration));
    },
    onPlay: () => {
      dispatch(playerActions.setIsPlaying(true));
    },
    onPause: () => {
      dispatch(playerActions.setIsPlaying(false));
    },
    onVolumeChange: (volume: number) => {
      dispatch(playerActions.setVolume(volume));
    },
    onError: (error: Error) => {
      if (error.name !== 'AbortError') {
        handlePlaybackError(error, dispatch, state.currentTrack?.id);
      }
    },
    onLoaded: () => {
      // Restore saved playback time if available
      if (state.currentTrack?.id) {
        const savedTime = getPlaybackTime(state.currentTrack.id);
        if (savedTime > 0 && audioRef.current) {
          const duration = audioRef.current.duration || 0;
          if (savedTime < duration) {
            seekTo(savedTime);
          }
        }
      }
      // Auto-play the track if flagged to do so
      if (shouldAutoPlayRef.current) {
        setTimeout(() => {
          play().catch((error) => {
            if (error.name !== 'AbortError') {
              handlePlaybackError(error, dispatch, state.currentTrack?.id);
            }
          });
          shouldAutoPlayRef.current = false; // Reset flag after auto-play
        }, 50);
      }
    },
  };

  // Initialize audio service using a custom hook
  const { 
    audioRef, 
    play, 
    pause, 
    toggle, 
    seekTo, 
    setVolume,
    loadTrack,
  } = useAudioElement('', state.volume, audioEventHandlers);

  useEffect(() => {
    if (isInitializedRef.current || tracks.length === 0) return;
  
    isInitializedRef.current = true;
    dispatch(playerActions.setCurrentTrack(tracks[0]));
    dispatch(playerActions.setTrackList(tracks));
  }, [tracks.length]);

  // Effect to load new audio when the current track changes
  useEffect(() => {
    if (!state.currentTrack?.file) return;
    if (prevTrackRef.current === state.currentTrack) return;

    prevTrackRef.current = state.currentTrack;
    const newSrc = `/audio/streaming/${state.currentTrack.file}`;
    dispatch(playerActions.setSharedAudioUrl(newSrc));
    loadTrack(newSrc);
  }, [state.currentTrack, loadTrack]);

  /**
   * Sets the current track in the player state.
   * Optionally triggers auto-play if the second parameter is true.
   */
  const setCurrentTrack = useCallback((track: Track | undefined, autoPlay: boolean = false) => {
    if (track === state.currentTrack) return;
    shouldAutoPlayRef.current = autoPlay;
    dispatch(playerActions.setCurrentTrack(track));
  }, [state.currentTrack]);

  /**
   * Plays a specific track.
   * If the track is already current, it toggles play/pause.
   * Otherwise, it sets the track with auto-play enabled.
   */
  const playTrack = useCallback((track: Track) => {
    if (track.id === state.currentTrack?.id) {
      toggle().catch((error) => {
        if (error.name !== 'AbortError') {
          handlePlaybackError(error, dispatch, state.currentTrack?.id);
        }
      });
      return;
    }
    setCurrentTrack(track, true);
  }, [state.currentTrack, toggle, setCurrentTrack, dispatch]);

  /**
   * Updates the track list in the player state.
   */
  const setTrackList = useCallback((tracks: Track[]) => {
    dispatch(playerActions.setTrackList(tracks));
  }, [dispatch]);

  /**
   * Toggles play/pause for the current track.
   */
  const handleTogglePlay = useCallback(() => {
    toggle().catch((error) => {
      if (error.name !== 'AbortError') {
        handlePlaybackError(error, dispatch, state.currentTrack?.id);
      }
    });
  }, [toggle, dispatch, state.currentTrack]);

  console.log('🔄 Creating context value, state keys:', Object.keys(state));

  // Memoize the context value to prevent unnecessary re-renders of consumers.
  const contextValue: PlayerContextType = useMemo(() => ({
    ...state,
    audioRef,
    dispatch,
    setCurrentTrack,
    setTrackList,
    togglePlay: handleTogglePlay,
    play,
    pause,
    setVolume,
    seekTo,
    setTrackEndHandler,
    playTrack,
  }), [
    state.isPlaying,
    state.currentTrack?.id,
    state.volume,
    state.currentTime,
    state.trackList.length,
    state.loopMode,
    audioRef,
    dispatch,
    setCurrentTrack,
    setTrackList,
    handleTogglePlay,
    play,
    pause,
    setVolume,
    seekTo,
    setTrackEndHandler,
    playTrack,
  ]);

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

/**
 * Custom hook for accessing the player context.
 */
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

// Re-export player actions for convenience
export { playerActions } from '../context/playerActions';
