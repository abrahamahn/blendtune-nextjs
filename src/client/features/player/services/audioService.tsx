/**
 * @fileoverview Core audio service that abstracts HTMLAudioElement functionality
 * @module features/player/services/audioService
 */

import { useRef, useCallback, useEffect, useState } from 'react';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  src: string;
  isLoading: boolean;
  error: Error | null;
}

export interface AudioActions {
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  loadTrack: (src: string) => void;
  jumpForward: (seconds?: number) => void;
  jumpBackward: (seconds?: number) => void;
}

export interface AudioEventHandlers {
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (error: Error) => void;
  onLoadStart?: () => void;
  onLoaded?: () => void;
}

export interface UseAudioElementReturn extends AudioState, AudioActions {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

/**
 * Custom hook for abstracting HTMLAudioElement functionality
 * Provides a clean interface for audio operations and state
 * 
 * @param initialSrc - Optional initial audio source
 * @param initialVolume - Optional initial volume (0-1)
 * @param eventHandlers - Optional event handlers for audio events
 * @returns Audio state, actions, and ref
 */
export const useAudioElement = (
  initialSrc: string = '',
  initialVolume: number = 1,
  eventHandlers: AudioEventHandlers = {}
): UseAudioElementReturn => {
  // Create ref for the audio element
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Audio state
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: initialVolume,
    src: initialSrc,
    isLoading: false,
    error: null
  });

  // Initialize audio element
  useEffect(() => {
    // Create audio element if it doesn't exist yet
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.volume = initialVolume;
      audioRef.current = audio;
    }

    const audioEl = audioRef.current;
    
    // Handle events
    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
      eventHandlers.onPlay?.();
    };
    
    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      eventHandlers.onPause?.();
    };
    
    const handleTimeUpdate = () => {
      const currentTime = audioEl.currentTime;
      setState(prev => ({ ...prev, currentTime }));
      eventHandlers.onTimeUpdate?.(currentTime);
    };
    
    const handleDurationChange = () => {
      if (!isNaN(audioEl.duration) && isFinite(audioEl.duration)) {
        setState(prev => ({ ...prev, duration: audioEl.duration }));
        eventHandlers.onDurationChange?.(audioEl.duration);
      }
    };
    
    const handleVolumeChange = () => {
      setState(prev => ({ ...prev, volume: audioEl.volume }));
      eventHandlers.onVolumeChange?.(audioEl.volume);
    };
    
    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      eventHandlers.onEnded?.();
    };

    const handleError = (e: ErrorEvent) => {
      const error = new Error(`Audio error: ${e.message}`);
      setState(prev => ({ ...prev, error, isLoading: false }));
      eventHandlers.onError?.(error);
    };

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true }));
      eventHandlers.onLoadStart?.();
    };

    const handleLoadedData = () => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        duration: audioEl.duration || 0 
      }));
      eventHandlers.onLoaded?.();
    };

    // Add event listeners
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('pause', handlePause);
    audioEl.addEventListener('timeupdate', handleTimeUpdate);
    audioEl.addEventListener('durationchange', handleDurationChange);
    audioEl.addEventListener('volumechange', handleVolumeChange);
    audioEl.addEventListener('ended', handleEnded);
    audioEl.addEventListener('error', handleError as EventListener);
    audioEl.addEventListener('loadstart', handleLoadStart);
    audioEl.addEventListener('loadeddata', handleLoadedData);
    
    // Load initial source if provided
    if (initialSrc && audioEl.src !== initialSrc) {
      audioEl.src = initialSrc;
    }

    // Cleanup
    return () => {
      audioEl.removeEventListener('play', handlePlay);
      audioEl.removeEventListener('pause', handlePause);
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      audioEl.removeEventListener('durationchange', handleDurationChange);
      audioEl.removeEventListener('volumechange', handleVolumeChange);
      audioEl.removeEventListener('ended', handleEnded);
      audioEl.removeEventListener('error', handleError as EventListener);
      audioEl.removeEventListener('loadstart', handleLoadStart);
      audioEl.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [initialSrc, initialVolume, eventHandlers]);

  /**
   * Load a new audio track
   */
  const loadTrack = useCallback((src: string) => {
    if (!audioRef.current) return;
    
    // Only reload if source has changed
    if (audioRef.current.src !== src) {
      // Reset state
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        src,
        isLoading: true,
        error: null
      }));

      // Update audio element
      audioRef.current.pause();
      audioRef.current.src = src;
      audioRef.current.load();
    }
  }, []);

  /**
   * Play audio
   */
  const play = useCallback(async () => {
    if (!audioRef.current) return Promise.reject(new Error('Audio element not available'));
    
    try {
      await audioRef.current.play();
      return Promise.resolve();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error(String(error)),
        isPlaying: false 
      }));
      return Promise.reject(error);
    }
  }, []);

  /**
   * Pause audio
   */
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  /**
   * Toggle play/pause
   */
  const toggle = useCallback(async () => {
    if (!audioRef.current) return Promise.reject(new Error('Audio element not available'));
    
    if (state.isPlaying) {
      pause();
      return Promise.resolve();
    } else {
      return play();
    }
  }, [state.isPlaying, play, pause]);

  /**
   * Seek to a specific time
   */
  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    // Validate time
    const safeTime = Math.max(0, Math.min(time, state.duration || 0));
    
    // Update audio time
    audioRef.current.currentTime = safeTime;
    setState(prev => ({ ...prev, currentTime: safeTime }));
  }, [state.duration]);

  /**
   * Set audio volume
   */
  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    
    // Validate volume
    const safeVolume = Math.max(0, Math.min(volume, 1));
    
    // Update audio volume
    audioRef.current.volume = safeVolume;
    setState(prev => ({ ...prev, volume: safeVolume }));
  }, []);

  /**
   * Jump forward by a specified number of seconds
   */
  const jumpForward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    const newTime = state.currentTime + seconds;
    seekTo(newTime);
  }, [state.currentTime, seekTo]);

  /**
   * Jump backward by a specified number of seconds
   */
  const jumpBackward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    const newTime = state.currentTime - seconds;
    seekTo(newTime);
  }, [state.currentTime, seekTo]);

  return {
    // State
    ...state,
    // Actions
    play,
    pause,
    toggle,
    seekTo,
    setVolume,
    loadTrack,
    jumpForward,
    jumpBackward,
    // Ref
    audioRef
  };
};