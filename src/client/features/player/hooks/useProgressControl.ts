// src/client/features/player/hooks/useProgressControl.ts
import { useCallback, useMemo } from "react";
import { usePlayer } from "../services/playerService";
import { useTrackNavigation } from "./useTrackNavigation";

/**
 * Shared progress control logic for clickable progress bars.
 */
export const useProgressControl = () => {
  const { audioRef, trackDuration } = usePlayer();
  const { seekTo } = useTrackNavigation();

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!audioRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const rawPercent = (e.clientX - rect.left) / rect.width;
      const clampedPercent = Math.max(0, Math.min(1, rawPercent));
      const duration =
        audioRef.current.duration || trackDuration || 0;
      const newTime = clampedPercent * duration;

      seekTo(newTime);
    },
    [audioRef, seekTo, trackDuration]
  );

  const progressPercent = useMemo(() => {
    const duration = audioRef.current?.duration ?? trackDuration ?? 0;
    const current = audioRef.current?.currentTime ?? 0;
    if (!duration) return 0;
    return (current / duration) * 100;
  }, [audioRef, trackDuration]);

  return { handleProgressClick, progressPercent };
};
