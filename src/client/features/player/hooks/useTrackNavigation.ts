/**
 * @fileoverview Fixed track navigation hook that properly maintains play state
 * @module features/player/hooks/useTrackNavigation
 */

import { useCallback, useEffect, useRef } from "react";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";
import { resetPlaybackTime, storePlaybackTime } from "../utils/storage";
import { Track } from "@/shared/types/track";

/**
 * Complete navigation hook
 */
export const useTrackNavigation = () => {
  // Get player context values with minimal dependencies
  const { 
    audioRef,
    currentTrack, 
    trackList, 
    loopMode,
    currentTime,
    isPlaying,
    dispatch,
    setTrackEndHandler,
    seekTo: playerSeekTo,
    togglePlay,
    play,
    pause
  } = usePlayer();
  
  // Store refs to prevent dependency cycles
  const currentTrackRef = useRef(currentTrack);
  const trackListRef = useRef(trackList);
  const loopModeRef = useRef(loopMode);
  const currentTimeRef = useRef(currentTime);
  const isPlayingRef = useRef(isPlaying);
  
  // Track if we should auto-play the next track and what caused the track change
  const shouldAutoPlayRef = useRef(false);
  const trackChangeSourceRef = useRef<'manual' | 'navigation' | 'end' | null>(null);
  
  // Update refs when values change
  useEffect(() => {
    currentTrackRef.current = currentTrack;
    trackListRef.current = trackList;
    loopModeRef.current = loopMode;
    currentTimeRef.current = currentTime;
    isPlayingRef.current = isPlaying;
  }, [currentTrack, trackList, loopMode, currentTime, isPlaying]);
  
  // Handle the track change logic
  useEffect(() => {
    if (!currentTrack) return;
    
    // Skip the first render
    if (trackChangeSourceRef.current === null) {
      trackChangeSourceRef.current = 'manual';
      return;
    }
    
    // Only handle auto-play if track changed by navigation or ended naturally
    if (trackChangeSourceRef.current === 'navigation' || trackChangeSourceRef.current === 'end') {
      // Small delay to ensure audio is loaded
      const timer = setTimeout(() => {
        if (shouldAutoPlayRef.current) {
          play().catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error auto-playing track:", error);
            }
          });
        }
        
        // Reset the flags
        shouldAutoPlayRef.current = false;
        trackChangeSourceRef.current = 'manual';
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentTrack, play]);
  
  /**
   * Save current playback position
   */
  const savePlaybackTime = useCallback(() => {
    if (!audioRef.current || !currentTrackRef.current?.id) return;
    
    const time = currentTimeRef.current;
    const duration = audioRef.current.duration;
    
    if (!isNaN(duration) && isFinite(duration) && time > 0) {
      const remainingTime = duration - time;
      if (remainingTime <= 45) {
        // Reset if near the end
        resetPlaybackTime(currentTrackRef.current.id);
      } else {
        storePlaybackTime(currentTrackRef.current.id, time);
      }
    }
  }, [audioRef]);
  
  /**
   * Seek to a specific time position
   */
  const seekTo = useCallback((time: number) => {
    playerSeekTo(time);
  }, [playerSeekTo]);
  
  /**
   * Set a track and play it immediately
   */
  const playTrack = useCallback((track: Track) => {
    if (!track) return;
    
    // Save current position before changing tracks
    savePlaybackTime();
    
    // Set flags to trigger auto-play
    shouldAutoPlayRef.current = true;
    trackChangeSourceRef.current = 'navigation';
    
    // Set the new track
    dispatch(playerActions.setCurrentTrack(track));
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Set a track without playing it
   */
  const selectTrack = useCallback((track: Track) => {
    if (!track) return;
    
    // Save current position before changing tracks
    savePlaybackTime();
    
    // Set flags to NOT trigger auto-play
    shouldAutoPlayRef.current = false;
    trackChangeSourceRef.current = 'navigation';
    
    // Set the new track
    dispatch(playerActions.setCurrentTrack(track));
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Go to next track
   * Maintains play state - if current track is playing, next will play automatically
   */
  const nextTrack = useCallback(() => {
    const tracks = trackListRef.current;
    const current = currentTrackRef.current;
    const wasPlaying = isPlayingRef.current;
    
    if (!tracks.length) return;
    savePlaybackTime();
    
    const currentIndex = tracks.findIndex(
      track => track.id === current?.id
    );
    
    if (currentIndex < tracks.length - 1) {
      // Set flags based on current play state
      shouldAutoPlayRef.current = wasPlaying;
      trackChangeSourceRef.current = 'navigation';
      
      // Select next track
      dispatch(playerActions.setCurrentTrack(tracks[currentIndex + 1]));
    }
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Go to previous track
   * Maintains play state - if current track is playing, previous will play automatically
   */
  const previousTrack = useCallback(() => {
    const tracks = trackListRef.current;
    const current = currentTrackRef.current;
    const wasPlaying = isPlayingRef.current;
    
    if (!tracks.length) return;
    savePlaybackTime();
    
    const currentIndex = tracks.findIndex(
      track => track.id === current?.id
    );
    
    if (currentIndex > 0) {
      // Set flags based on current play state
      shouldAutoPlayRef.current = wasPlaying;
      trackChangeSourceRef.current = 'navigation';
      
      // Select previous track
      dispatch(playerActions.setCurrentTrack(tracks[currentIndex - 1]));
    }
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Jump forward by seconds
   */
  const jumpForward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    seekTo(currentTimeRef.current + seconds);
  }, [audioRef, seekTo]);
  
  /**
   * Jump backward by seconds
   */
  const jumpBackward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    seekTo(Math.max(0, currentTimeRef.current - seconds));
  }, [audioRef, seekTo]);
  
  /**
   * Cycle through loop modes (off → one → all → off)
   */
  const loopTrack = useCallback(() => {
    const current = currentTrackRef.current;
    const loop = loopModeRef.current;
    
    if (!current) return;
  
    if (loop === "off") {
      dispatch(playerActions.setLoopMode("one"));
      dispatch(playerActions.setLoopedTrackList([current]));
    } else if (loop === "one") {
      dispatch(playerActions.setLoopMode("all"));
      dispatch(playerActions.setLoopedTrackList([]));
    } else if (loop === "all") {
      dispatch(playerActions.setLoopMode("off"));
      dispatch(playerActions.setLoopedTrackList([]));
    }
  }, [dispatch]);
  
  /**
   * Handle track end based on loop mode
   */
  const handleTrackEnd = useCallback(() => {
    const current = currentTrackRef.current;
    const tracks = trackListRef.current;
    const loop = loopModeRef.current;
    
    if (!current?.id) return;
    resetPlaybackTime(current.id);
    
    if (loop === "one") {
      // Loop the same track
      seekTo(0);
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          // Ignore AbortError
          if (err.name !== 'AbortError') {
            console.error("Error replaying track:", err);
          }
        });
      }
      return;
    }
    
    const currentIndex = tracks.findIndex(
      track => track.id === current?.id
    );
    
    if (loop === "all" || (currentIndex < tracks.length - 1)) {
      // Set flags - track ended naturally, so we always want to play the next one
      shouldAutoPlayRef.current = true;
      trackChangeSourceRef.current = 'end';
      
      // Play next track or loop to first
      if (currentIndex === tracks.length - 1 && loop === "all") {
        dispatch(playerActions.setCurrentTrack(tracks[0]));
      } else if (currentIndex < tracks.length - 1) {
        dispatch(playerActions.setCurrentTrack(tracks[currentIndex + 1]));
      }
    }
  }, [audioRef, dispatch, seekTo]);
  
  // Register track end handler once
  useEffect(() => {
    setTrackEndHandler(() => handleTrackEnd);
  }, [handleTrackEnd, setTrackEndHandler]);
  
  return {
    togglePlayPause: togglePlay,
    previousTrack,
    nextTrack,
    jumpForward,
    jumpBackward,
    savePlaybackTime,
    seekTo,
    loopTrack,
    playTrack,
    selectTrack,
    play,
    pause
  };
};

export default useTrackNavigation;