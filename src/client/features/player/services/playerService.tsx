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
  Dispatch
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
 * Player Provider component
 */
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize player state and dispatch
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const { tracks } = useTracks();
  
  // Track end handler to prevent circular dependencies
  const [trackEndHandler, setTrackEndHandler] = useState<() => void>(() => () => {});
  
  // Track initialization flag
  const isInitializedRef = useRef(false);
  
  // Refs to track previous values
  const prevTrackRef = useRef<Track | undefined>(undefined);
  
  // Track auto-play flag
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
      // Only log non-abort errors
      if (error.name !== 'AbortError') {
        console.error("Audio playback error:", error);
      }
    },
    onLoaded: () => {
      // Restore saved time if available
      if (state.currentTrack?.id) {
        const savedTime = getPlaybackTime(state.currentTrack.id);
        if (savedTime > 0 && audioRef.current) {
          const duration = audioRef.current.duration || 0;
          if (savedTime < duration) {
            seekTo(savedTime);
          }
        }
      }
      
      // Auto-play if flag is explicitly set
      if (shouldAutoPlayRef.current) {
        setTimeout(() => {
          play().catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error auto-playing after load:", error);
            }
          });
          shouldAutoPlayRef.current = false; // Reset flag after use
        }, 50);
      }
    }
  };
  
  // Initialize audio service with handlers
  const { 
    audioRef, 
    play, 
    pause, 
    toggle, 
    seekTo, 
    setVolume,
    loadTrack
  } = useAudioElement('', state.volume, audioEventHandlers);

  // One-time initialization effect
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    if (tracks.length > 0 && !state.currentTrack) {
      isInitializedRef.current = true;
      
      // Set the first track and track list, but don't trigger audio loading yet
      dispatch(playerActions.setCurrentTrack(tracks[0]));
      dispatch(playerActions.setTrackList(tracks));
    }
  }, [tracks, state.currentTrack]);

  // Effect to load audio when track changes
  useEffect(() => {
    // Skip if no current track
    if (!state.currentTrack?.file) return;
    
    // Skip if track hasn't actually changed
    if (prevTrackRef.current === state.currentTrack) return;
    
    // Update track reference
    prevTrackRef.current = state.currentTrack;
    
    // Load new audio source
    const newSrc = `/audio/tracks/${state.currentTrack.file}`;
    dispatch(playerActions.setSharedAudioUrl(newSrc));
    loadTrack(newSrc);
  }, [state.currentTrack, loadTrack]);

  /**
   * Set current track in player state with optional auto-play flag
   */
  const setCurrentTrack = useCallback((track: Track | undefined, autoPlay: boolean = false) => {
    if (track === state.currentTrack) return;
    
    // Set auto-play flag based on parameter
    shouldAutoPlayRef.current = autoPlay;
    
    dispatch(playerActions.setCurrentTrack(track));
  }, [state.currentTrack]);

  /**
   * Play a specific track - convenient method for catalog components
   */
  const playTrack = useCallback((track: Track) => {
    // If it's the current track, just toggle play/pause
    if (track.id === state.currentTrack?.id) {
      toggle().catch(error => {
        if (error.name !== 'AbortError') {
          console.error("Error toggling playback:", error);
        }
      });
      return;
    }
    
    // Otherwise, set track with auto-play
    setCurrentTrack(track, true);
  }, [state.currentTrack, toggle, setCurrentTrack]);

  /**
   * Update track list in player state
   */
  const setTrackList = useCallback((tracks: Track[]) => {
    dispatch(playerActions.setTrackList(tracks));
  }, []);

  /**
   * Toggle play/pause for current track
   */
  const handleTogglePlay = useCallback(() => {
    toggle().catch(error => {
      if (error.name !== 'AbortError') {
        console.error("Error toggling playback:", error);
      }
    });
  }, [toggle]);

  // Combine all context values and methods
  const contextValue: PlayerContextType = {
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
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

/**
 * Custom hook for accessing player context
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