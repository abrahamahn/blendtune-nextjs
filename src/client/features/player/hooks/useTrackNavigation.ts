// src\client\features\player\hooks\useTrackNavigation.ts
/**
 * @fileoverview Fixed track navigation hook that properly maintains play state
 * and uses useCallback for all functions passed to child components.
 * @module features/player/hooks/useTrackNavigation
 */

import { useCallback, useEffect, useRef } from "react";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";
import { resetPlaybackTime, storePlaybackTime } from "../utils/storage";
import { Track } from "@/shared/types/track";

/**
 * Custom hook for handling track navigation and playback control.
 * It includes functions for saving playback time, seeking, navigating tracks,
 * and managing loop modes—all memoized via useCallback to ensure stable references.
 */
export const useTrackNavigation = () => {
  // Retrieve necessary player state and control functions from context.
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
  
  // Refs to store current values (avoids including them in dependency arrays)
  const currentTrackRef = useRef(currentTrack);
  const trackListRef = useRef(trackList);
  const loopModeRef = useRef(loopMode);
  const currentTimeRef = useRef(currentTime);
  const isPlayingRef = useRef(isPlaying);
  
  // Refs for auto-play behavior and track change source detection.
  const shouldAutoPlayRef = useRef(false);
  const trackChangeSourceRef = useRef<'manual' | 'navigation' | 'end' | null>(null);
  
  // Update refs whenever the corresponding state values change.
  useEffect(() => {
    currentTrackRef.current = currentTrack;
    trackListRef.current = trackList;
    loopModeRef.current = loopMode;
    currentTimeRef.current = currentTime;
    isPlayingRef.current = isPlaying;
  }, [currentTrack, trackList, loopMode, currentTime, isPlaying]);
  
  // Effect to auto-play a track after navigation or natural track end.
  useEffect(() => {
    if (!currentTrack) return;
    
    // On first render, default to 'manual' without auto-playing.
    if (trackChangeSourceRef.current === null) {
      trackChangeSourceRef.current = 'manual';
      return;
    }
    
    // If track change was due to navigation or a natural end, auto-play after a brief delay.
    if (trackChangeSourceRef.current === 'navigation' || trackChangeSourceRef.current === 'end') {
      const timer = setTimeout(() => {
        if (shouldAutoPlayRef.current) {
          play().catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error auto-playing track:", error);
            }
          });
        }
        // Reset flags after handling auto-play.
        shouldAutoPlayRef.current = false;
        trackChangeSourceRef.current = 'manual';
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentTrack, play]);
  
  /**
   * Save the current playback position of the track.
   * Checks if near the end of the track and resets or stores the time accordingly.
   */
  const savePlaybackTime = useCallback(() => {
    if (!audioRef.current || !currentTrackRef.current?.id) return;
    
    const time = currentTimeRef.current;
    const duration = audioRef.current.duration;
    
    if (!isNaN(duration) && isFinite(duration) && time > 0) {
      const remainingTime = duration - time;
      if (remainingTime <= 45) {
        // Reset playback time if the track is almost finished.
        resetPlaybackTime(currentTrackRef.current.id);
      } else {
        // Otherwise, store the current playback time.
        storePlaybackTime(currentTrackRef.current.id, time);
      }
    }
  }, [audioRef]);
  
  /**
   * Seek the current track to a specified time.
   * Delegates to the playerSeekTo function provided by the player context.
   */
  const seekTo = useCallback((time: number) => {
    playerSeekTo(time);
  }, [playerSeekTo]);
  
  /**
   * Set a new track and automatically play it.
   * Saves current playback time, sets auto-play flags, and updates the current track.
   */
  const playTrack = useCallback((track: Track) => {
    if (!track) return;
    
    // Save the current playback position before switching tracks.
    savePlaybackTime();
    
    // Set flags to auto-play the new track.
    shouldAutoPlayRef.current = true;
    trackChangeSourceRef.current = 'navigation';
    
    // Dispatch action to update the current track.
    dispatch(playerActions.setCurrentTrack(track));
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Set a new track without auto-playing it.
   * Useful for scenarios where the user wants to select a track for preview.
   */
  const selectTrack = useCallback((track: Track) => {
    if (!track) return;
    
    // Save the current playback position before changing tracks.
    savePlaybackTime();
    
    // Disable auto-play and mark the track change as manual navigation.
    shouldAutoPlayRef.current = false;
    trackChangeSourceRef.current = 'navigation';
    
    // Dispatch action to update the current track.
    dispatch(playerActions.setCurrentTrack(track));
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Navigate to the next track.
   * Preserves the play state: if the current track was playing, the next will auto-play.
   */
  const nextTrack = useCallback(() => {
    const tracks = trackListRef.current;
    const current = currentTrackRef.current;
    const wasPlaying = isPlayingRef.current;
    
    if (!tracks.length) return;
    savePlaybackTime();
    
    const currentIndex = tracks.findIndex(track => track.id === current?.id);
    
    if (currentIndex < tracks.length - 1) {
      // Set flags based on the current play state.
      shouldAutoPlayRef.current = wasPlaying;
      trackChangeSourceRef.current = 'navigation';
      
      // Dispatch action to set the next track.
      dispatch(playerActions.setCurrentTrack(tracks[currentIndex + 1]));
    }
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Navigate to the previous track.
   * Preserves the play state similarly to nextTrack.
   */
  const previousTrack = useCallback(() => {
    const tracks = trackListRef.current;
    const current = currentTrackRef.current;
    const wasPlaying = isPlayingRef.current;
    
    if (!tracks.length) return;
    savePlaybackTime();
    
    const currentIndex = tracks.findIndex(track => track.id === current?.id);
    
    if (currentIndex > 0) {
      // Set flags based on whether the track was playing.
      shouldAutoPlayRef.current = wasPlaying;
      trackChangeSourceRef.current = 'navigation';
      
      // Dispatch action to set the previous track.
      dispatch(playerActions.setCurrentTrack(tracks[currentIndex - 1]));
    }
  }, [dispatch, savePlaybackTime]);
  
  /**
   * Jump forward by a specified number of seconds (default is 10 seconds).
   */
  const jumpForward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    seekTo(currentTimeRef.current + seconds);
  }, [audioRef, seekTo]);
  
  /**
   * Jump backward by a specified number of seconds (default is 10 seconds).
   */
  const jumpBackward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    seekTo(Math.max(0, currentTimeRef.current - seconds));
  }, [audioRef, seekTo]);
  
  /**
   * Cycle through loop modes: off → one → all → off.
   * Updates both the loop mode and the looped track list.
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
   * Handle the end of a track.
   * Depending on the loop mode, this may restart the current track or move to the next one.
   */
  const handleTrackEnd = useCallback(() => {
    const current = currentTrackRef.current;
    const tracks = trackListRef.current;
    const loop = loopModeRef.current;
    
    if (!current?.id) return;
    resetPlaybackTime(current.id);
    
    if (loop === "one") {
      // Restart the same track.
      seekTo(0);
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Error replaying track:", err);
          }
        });
      }
      return;
    }
    
    const currentIndex = tracks.findIndex(track => track.id === current?.id);
    
    if (loop === "all" || (currentIndex < tracks.length - 1)) {
      // For natural end or when in loop mode "all", flag auto-play.
      shouldAutoPlayRef.current = true;
      trackChangeSourceRef.current = 'end';
      
      // Dispatch action to move to the next track or loop back to the first.
      if (currentIndex === tracks.length - 1 && loop === "all") {
        dispatch(playerActions.setCurrentTrack(tracks[0]));
      } else if (currentIndex < tracks.length - 1) {
        dispatch(playerActions.setCurrentTrack(tracks[currentIndex + 1]));
      }
    }
  }, [audioRef, dispatch, seekTo]);
  
  // Register the track end handler so the player knows how to proceed when a track ends.
  useEffect(() => {
    setTrackEndHandler(() => handleTrackEnd);
  }, [handleTrackEnd, setTrackEndHandler]);
  
  // Return all memoized navigation functions to be used by player controls.
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
