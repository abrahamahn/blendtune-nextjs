/**
 * @fileoverview Hook for track navigation functionality
 * @module features/player/hooks/useTrackNavigation
 */

import { useCallback, useEffect } from "react";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";
import { storePlaybackTime, resetPlaybackTime } from "../utils/storage";

/**
 * Custom hook that provides track navigation functionality
 * Manages previous/next track navigation and loop mode cycling
 */
export const useTrackNavigation = () => {
  const { 
    audioRef, 
    currentTrack, 
    trackList, 
    loopMode,
    isPlaying,
    dispatch,
    setTrackEndHandler
  } = usePlayer();
  
  /**
   * Saves current playback time to localStorage
   */
  const savePlaybackTime = useCallback(() => {
    if (!audioRef.current || !currentTrack?.id) return;
    const time = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const remainingTime = duration - time;
    if (!isNaN(duration) && isFinite(duration) && time > 0) {
      if (remainingTime <= 45) {
        // Reset playback time if we're near the end of the track
        resetPlaybackTime(currentTrack.id);
      } else {
        storePlaybackTime(currentTrack.id, time);
      }
    }
  }, [audioRef, currentTrack]);

  /**
   * Toggles play/pause state
   */
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(playerActions.setIsPlaying(false));
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("❌ Error Playing:", error));
      dispatch(playerActions.setIsPlaying(true));
    }
  }, [audioRef, isPlaying, dispatch]);

  /**
   * Seek to a specific time position in the track
   */
  const seekTo = useCallback((timeInSeconds: number) => {
    if (!audioRef.current) return;
    
    // Ensure the time is within valid bounds
    const duration = audioRef.current.duration;
    const safeTime = Math.max(0, Math.min(duration, timeInSeconds));
    
    // Set the current time
    audioRef.current.currentTime = safeTime;
    dispatch(playerActions.setCurrentTime(safeTime));
    
    // Store the updated position
    if (currentTrack?.id) {
      storePlaybackTime(currentTrack.id, safeTime);
    }
  }, [audioRef, currentTrack, dispatch]);

  /**
   * Jump forward by a specific amount of seconds
   */
  const jumpForward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    const newTime = audioRef.current.currentTime + seconds;
    seekTo(newTime);
  }, [audioRef, seekTo]);

  /**
   * Jump backward by a specific amount of seconds
   */
  const jumpBackward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    const newTime = audioRef.current.currentTime - seconds;
    seekTo(newTime);
  }, [audioRef, seekTo]);

  /**
   * Navigate to next track in playlist
   */
  const nextTrack = useCallback(() => {
    if (!trackList.length) return;
    savePlaybackTime();
    const currentIndex = trackList.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex < trackList.length - 1) {
      const next = trackList[currentIndex + 1];
      dispatch(playerActions.setCurrentTrack(next));
    }
  }, [trackList, currentTrack, dispatch, savePlaybackTime]);

  /**
   * Navigate to previous track in playlist
   */
  const previousTrack = useCallback(() => {
    if (!trackList.length) return;
    savePlaybackTime();
    const currentIndex = trackList.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex > 0) {
      const prev = trackList[currentIndex - 1];
      dispatch(playerActions.setCurrentTrack(prev));
    }
  }, [trackList, currentTrack, dispatch, savePlaybackTime]);

  /**
   * Cycle through loop modes (off → one → all → off)
   */
  const loopTrack = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
  
    if (loopMode === "off") {
      dispatch(playerActions.setLoopMode("one"));
      dispatch(playerActions.setLoopedTrackList([currentTrack]));
    } else if (loopMode === "one") {
      dispatch(playerActions.setLoopMode("all"));
      dispatch(playerActions.setLoopedTrackList([]));
    } else if (loopMode === "all") {
      dispatch(playerActions.setLoopMode("off"));
      dispatch(playerActions.setLoopedTrackList([]));
    }
  }, [audioRef, currentTrack, loopMode, dispatch]);
  
  /**
   * Handle what happens when a track ends
   */
  const handleTrackEnd = useCallback(() => {
    if (!currentTrack?.id) return;
    
    resetPlaybackTime(currentTrack.id);

    if (loopMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing audio:", error);
          }
        });
      }
      return;
    }

    if (loopMode === "all") {
      const currentIndex = trackList.findIndex(
        (track) => track.id === currentTrack?.id
      );
      if (currentIndex === trackList.length - 1) {
        dispatch(playerActions.setCurrentTrack(trackList[0]));
      } else {
        dispatch(playerActions.setCurrentTrack(trackList[currentIndex + 1]));
      }
      return;
    }

    // Default behavior (loopMode === "off")
    const currentIndex = trackList.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex < trackList.length - 1) {
      dispatch(playerActions.setCurrentTrack(trackList[currentIndex + 1]));
    }
  }, [audioRef, currentTrack, trackList, loopMode, dispatch]);
  
  // Register the track end handler with the context
  useEffect(() => {
    setTrackEndHandler(() => handleTrackEnd);
  }, [handleTrackEnd, setTrackEndHandler]);

  return { 
    togglePlayPause,
    previousTrack, 
    nextTrack, 
    loopTrack, 
    savePlaybackTime,
    seekTo,
    jumpForward,
    jumpBackward
  };
};

export default useTrackNavigation;