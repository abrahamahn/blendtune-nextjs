/**
 * @fileoverview Updated hook for track navigation functionality using AudioService
 * @module features/player/hooks/useTrackNavigation
 */

import { useCallback, useEffect } from "react";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";
import { resetPlaybackTime, storePlaybackTime } from "../utils/storage";

/**
 * Custom hook that provides track navigation functionality
 * Manages previous/next track navigation and loop mode cycling
 * Uses the new AudioService abstraction via PlayerProvider
 */
export const useTrackNavigation = () => {
  const { 
    audioRef,
    currentTrack, 
    trackList, 
    loopMode,
    currentTime,
    dispatch,
    setTrackEndHandler,
    seekTo
  } = usePlayer();
  
  /**
   * Saves current playback time to localStorage
   */
  const savePlaybackTime = useCallback(() => {
    if (!audioRef.current || !currentTrack?.id) return;
    
    const time = currentTime;
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
  }, [audioRef, currentTrack, currentTime]);

  /**
   * Jump forward by a specific amount of seconds
   */
  const jumpForward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    const newTime = currentTime + seconds;
    seekTo(newTime);
  }, [currentTime, seekTo, audioRef]);

  /**
   * Jump backward by a specific amount of seconds
   */
  const jumpBackward = useCallback((seconds: number = 10) => {
    if (!audioRef.current) return;
    const newTime = currentTime - seconds;
    seekTo(newTime);
  }, [currentTime, seekTo, audioRef]);

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
    if (!currentTrack) return;
  
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
  }, [currentTrack, loopMode, dispatch]);
  
  /**
   * Handle what happens when a track ends
   */
  const handleTrackEnd = useCallback(() => {
    if (!currentTrack?.id) return;
    
    resetPlaybackTime(currentTrack.id);

    if (loopMode === "one") {
      if (audioRef.current) {
        seekTo(0);
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
  }, [audioRef, currentTrack, trackList, loopMode, dispatch, seekTo]);
  
  // Register the track end handler with the context
  useEffect(() => {
    setTrackEndHandler(() => handleTrackEnd);
  }, [handleTrackEnd, setTrackEndHandler]);

  return { 
    togglePlayPause: usePlayer().togglePlay, // Use the togglePlay from the player context
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