// src\client\features\player\services\playerService.tsx
/**
 * @fileoverview Final PlayerProvider with flexible playback control
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
  RefObject,
  Dispatch,
  useMemo
} from 'react';
import { Track } from '@/shared/types/track';
import { playerReducer, initialPlayerState } from '../context/playerReducer';
import { playerActions } from '../context/playerActions';
import { storePlaybackTime, getPlaybackTime } from '../utils/storage';
import { useTracks } from "@/client/features/tracks";
import { useAudioElement, AudioEventHandlers } from '../services/audioService';

// Define PlayerAction type from action creators
export type PlayerAction =
  | ReturnType<typeof playerActions.setCurrentTrack>
  | ReturnType<typeof playerActions.setIsPlaying>
  | ReturnType<typeof playerActions.setTrackList>
  | ReturnType<typeof playerActions.setLoopedTrackList>
  | ReturnType<typeof playerActions.setLoopMode>
  | ReturnType<typeof playerActions.setIsVolumeVisible>
  | ReturnType<typeof playerActions.setCurrentTime>
  | ReturnType<typeof playerActions.setTrackDuration>
  | ReturnType<typeof playerActions.setVolume>
  | ReturnType<typeof playerActions.setSharedAudioUrl>;

// Define PlayerState interface
export interface PlayerState {
  currentTrack: Track | undefined;
  isPlaying: boolean;
  trackList: Track[];
  loopedTrackList: Track[];
  loopMode: "off" | "one" | "all";
  isVolumeVisible: boolean;
  currentTime: number;
  trackDuration: number;
  volume: number;
  sharedAudioUrl: string;
}

// Define PlayerContextType interface
export interface PlayerContextType extends PlayerState {
  audioRef: RefObject<HTMLAudioElement | null>;
  dispatch: Dispatch<PlayerAction>;
  setCurrentTrack: (track: Track | undefined, autoPlay?: boolean) => void;
  setTrackList: (tracks: Track[]) => void;
  togglePlay: () => void;
  play: () => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setTrackEndHandler: Dispatch<React.SetStateAction<() => void>>;
  playTrack: (track: Track) => void;
}

// Create the context for player state and methods
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

/**
 * Player Provider component that manages playback state and control functions.
 * It also memoizes the context value to prevent unnecessary re-renders of context consumers.
 */
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize player state and dispatch using a reducer
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const { tracks } = useTracks();
  
  // State for handling track end events to avoid circular dependencies
  const [trackEndHandler, setTrackEndHandler] = useState<() => void>(() => () => {});
  
  // Ref to track initialization status (one-time setup)
  const isInitializedRef = useRef(false);
  
  // Ref to store the previous track to detect changes
  const prevTrackRef = useRef<Track | undefined>(undefined);
  
  // Ref flag to determine if auto-play should occur on track load
  const shouldAutoPlayRef = useRef(false);
  
  // Define audio event handlers with minimal dependencies
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
      // Only log errors that are not abort-related
      if (error.name !== 'AbortError') {
        console.error("Audio playback error:", error);
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
          play().catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error auto-playing after load:", error);
            }
          });
          shouldAutoPlayRef.current = false; // Reset flag after auto-play
        }, 50);
      }
    }
  };
  
  // Initialize audio service using a custom hook
  const { 
    audioRef, 
    play, 
    pause, 
    toggle, 
    seekTo, 
    setVolume,
    loadTrack
  } = useAudioElement('', state.volume, audioEventHandlers);

  // One-time initialization effect for setting default track and track list
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    if (tracks.length > 0 && !state.currentTrack) {
      isInitializedRef.current = true;
      
      // Set the first track as the current track and update the track list
      dispatch(playerActions.setCurrentTrack(tracks[0]));
      dispatch(playerActions.setTrackList(tracks));
    }
  }, [tracks, state.currentTrack]);

  // Effect to load new audio when the current track changes
  useEffect(() => {
    // If there is no current track or file, do nothing
    if (!state.currentTrack?.file) return;
    
    // Prevent re-loading if the track hasn't changed
    if (prevTrackRef.current === state.currentTrack) return;
    
    // Update the previous track ref
    prevTrackRef.current = state.currentTrack;
    
    // Load new audio source based on the current track's file property
    const newSrc = `/audio/tracks/${state.currentTrack.file}`;
    dispatch(playerActions.setSharedAudioUrl(newSrc));
    loadTrack(newSrc);
  }, [state.currentTrack, loadTrack]);

  /**
   * Sets the current track in the player state.
   * Optionally triggers auto-play if the second parameter is true.
   */
  const setCurrentTrack = useCallback((track: Track | undefined, autoPlay: boolean = false) => {
    if (track === state.currentTrack) return;
    
    // Set auto-play flag based on parameter
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
      toggle().catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Error toggling playback:", error);
        }
      });
      return;
    }
    
    setCurrentTrack(track, true);
  }, [state.currentTrack, toggle, setCurrentTrack]);

  /**
   * Updates the track list in the player state.
   */
  const setTrackList = useCallback((tracks: Track[]) => {
    dispatch(playerActions.setTrackList(tracks));
  }, []);

  /**
   * Toggles play/pause for the current track.
   */
  const handleTogglePlay = useCallback(() => {
    toggle().catch(error => {
      if (error.name !== 'AbortError') {
        console.error("Error toggling playback:", error);
      }
    });
  }, [toggle]);

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
    playTrack
  }), [
    state,
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
    playTrack
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
