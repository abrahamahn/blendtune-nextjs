// src\client\features\player\hooks\useVolumeControl.ts
/**
 * @fileoverview Hook for volume control functionality
 * @module features/player/hooks/useVolumeControl
 */

import { useCallback } from "react";
import { faVolumeLow, faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";

/**
 * Custom hook for volume control features
 * Manages volume state, icon selection, and wheel events
 */
export const useVolumeControl = () => {
  const { audioRef, volume, isVolumeVisible, dispatch } = usePlayer();

  /**
   * Update volume level
   */
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    dispatch(playerActions.setVolume(clampedVolume));
  }, [audioRef, dispatch]);

  /**
   * Toggle volume control visibility
   */
  const toggleVolumeVisibility = useCallback(() => {
    dispatch(playerActions.setIsVolumeVisible(!isVolumeVisible));
  }, [isVolumeVisible, dispatch]);

  /**
   * Determine appropriate volume icon based on level
   */
  const getVolumeIcon = (): IconDefinition => {
    const volPercent = Math.round(volume * 100);
    
    if (volPercent === 0) return faVolumeXmark;
    if (volPercent >= 70) return faVolumeHigh;
    return faVolumeLow;
  };

  /**
   * Handle mouse wheel volume adjustment on the music player
   */
  const handleVolumeWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const step = 0.05;
    setVolume(Math.max(0, Math.min(1, volume - Math.sign(e.deltaY) * step)));
  }, [volume, setVolume]);

  /**
   * Toggle volume mute state
   */
  const toggleMute = useCallback(() => {
    if (volume > 0) {
      // Store current volume before muting
      if (audioRef.current && audioRef.current.dataset) {
        audioRef.current.dataset.previousVolume = volume.toString();
      }
      setVolume(0);
    } else {
      // Restore previous volume, or default to 0.5
      const prevVol = audioRef.current?.dataset?.previousVolume;
      const previousVolume = prevVol ? parseFloat(prevVol) : 0.5;
      setVolume(previousVolume);
    }
  }, [audioRef, volume, setVolume]);

  return {
    volume,
    setVolume,
    volumeIcon: getVolumeIcon(),
    handleVolumeWheel,
    toggleMute,
    toggleVolumeVisibility,
    isVolumeVisible,
    isMuted: volume === 0
  };
};

export default useVolumeControl;