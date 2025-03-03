/**
 * @fileoverview Hook for handling keyboard shortcuts for player controls
 * @module features/player/hooks/useKeyboardShortcuts
 */

import { useEffect, useRef } from "react";
import { usePlayer } from "@/client/features/player/services/playerService";
import { useTrackNavigation } from "./useTrackNavigation";

/**
 * Hook for handling keyboard shortcuts for the music player
 * - Space: Play/Pause
 * - Arrow Left/Right: Seek -/+ 10s (with Shift: Previous/Next track)
 * - Arrow Up/Down: Volume +/- (with Shift: Max/Min)
 */
export const useKeyboardShortcuts = () => {
  const { audioRef, volume, setVolume } = usePlayer();
  const { 
    togglePlayPause, 
    jumpBackward, 
    jumpForward, 
    previousTrack, 
    nextTrack 
  } = useTrackNavigation();

  // Use refs to avoid dependency changes triggering effect reruns
  const volumeRef = useRef(volume);
  
  // Update refs when values change
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!audioRef.current) return;
      
      // Ignore shortcuts when typing in input elements
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }
      
      switch (event.key) {
        case " ":
        case "Spacebar":
          event.preventDefault();
          togglePlayPause();
          break;
          
        case "ArrowLeft":
          if (event.shiftKey) {
            event.preventDefault();
            previousTrack();
          } else {
            jumpBackward(10);
          }
          break;
          
        case "ArrowRight":
          if (event.shiftKey) {
            event.preventDefault();
            nextTrack();
          } else {
            jumpForward(10);
          }
          break;
          
        case "ArrowUp":
          event.preventDefault();
          if (event.shiftKey) {
            setVolume(1); // Max volume
          } else {
            setVolume(Math.min(1, volumeRef.current + 0.05));
          }
          break;
          
        case "ArrowDown":
          event.preventDefault();
          if (event.shiftKey) {
            setVolume(0); // Mute
          } else {
            setVolume(Math.max(0, volumeRef.current - 0.05));
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    audioRef, 
    togglePlayPause, 
    previousTrack, 
    nextTrack, 
    jumpBackward, 
    jumpForward, 
    setVolume
  ]);
};

export default useKeyboardShortcuts;