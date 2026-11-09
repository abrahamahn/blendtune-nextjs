// main/apps/web/src/client/features/player/hooks/volume/useVolumeState.ts
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { faVolumeLow, faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { usePlayer } from "@client/features/player/services/playerService";
import { playerActions } from "@client/features/player/context/playerActions";

/**
 * Calculates volume based on vertical mouse position and element bounding rectangle.
 */
export const calculateVolume = (clientY: number, rect: DOMRect): number => {
  const newVolume = 1 - (clientY - rect.top) / rect.height;
  return Math.max(0, Math.min(1, newVolume));
};

/**
 * Manages core volume state and mute/unmute operations.
 */
export const useVolumeState = (initialVolume = 0.5) => {
  const { audioRef, volume: storedVolume, dispatch } = usePlayer();
  const [localVolume, setLocalVolume] = useState(storedVolume);
  const prevVolumeRef = useRef(storedVolume > 0 ? storedVolume : initialVolume);
  const updatingRef = useRef(false);

  useEffect(() => {
    if (!updatingRef.current && storedVolume !== localVolume) {
      setLocalVolume(storedVolume);
    }
  }, [storedVolume, localVolume]);

  const setVolume = useCallback(
    (newVolume: number) => {
      if (updatingRef.current) return;
      updatingRef.current = true;

      try {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));

        if (clampedVolume > 0) {
          prevVolumeRef.current = clampedVolume;
        }

        if (audioRef.current) {
          audioRef.current.volume = clampedVolume;
        }

        dispatch(playerActions.setVolume(clampedVolume));
        setLocalVolume(clampedVolume);
      } finally {
        setTimeout(() => {
          updatingRef.current = false;
        }, 0);
      }
    },
    [audioRef, dispatch],
  );

  const toggleMute = useCallback(() => {
    if (localVolume > 0) {
      prevVolumeRef.current = localVolume;
      setVolume(0);
    } else {
      setVolume(prevVolumeRef.current);
    }
  }, [localVolume, setVolume]);

  return {
    volume: localVolume,
    setVolume,
    toggleMute,
  };
};

/**
 * Provides volume-related UI icon and transform calculations.
 */
export const useVolumeDisplay = (volume: number) => {
  const volumeIcon = useMemo((): IconDefinition => {
    const volPercent = Math.round(volume * 100);
    if (volPercent === 0) return faVolumeXmark;
    if (volPercent >= 70) return faVolumeHigh;
    return faVolumeLow;
  }, [volume]);

  const iconTransform = useMemo(() => {
    const volPercent = Math.round(volume * 100);
    return volPercent === 0
      ? "translateX(2.5px)"
      : volPercent === 100
        ? "translateX(3.5px)"
        : "translateX(0)";
  }, [volume]);

  return {
    volumeIcon,
    iconTransform,
  };
};
