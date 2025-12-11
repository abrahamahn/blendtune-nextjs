// src/client/features/player/hooks/usePlaybackPersistence.ts
/**
 * Persist/resume playback time for the current track.
 */
import { RefObject, useEffect } from "react";
import { Track } from "@/shared/types/track";
import { getPlaybackTime, storePlaybackTime, resetPlaybackTime } from "../utils/storage";

export const usePlaybackPersistence = (
  audioRef: RefObject<HTMLAudioElement | null>,
  currentTrack: Track | undefined
) => {

  // Restore saved time when a track loads
  useEffect(() => {
    if (!currentTrack?.id || !audioRef.current) return;
    const saved = getPlaybackTime(currentTrack.id);
    if (saved > 0 && audioRef.current.duration && saved < audioRef.current.duration) {
      audioRef.current.currentTime = saved;
    }
  }, [audioRef, currentTrack]);

  // Save on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!audioRef.current || !currentTrack?.id) return;
      const time = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      if (duration && duration - time <= 45) {
        resetPlaybackTime(currentTrack.id);
      } else {
        storePlaybackTime(currentTrack.id, time);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [audioRef, currentTrack]);
};
