// src\client\features\sounds\catalog\hooks\useImagePreloader.ts

import { useCallback } from "react";
import { Track } from "@/shared/types/track";
import { getImageUrl } from "@/client/features/sounds/catalog/utils/trackUtils";

/**
 * Custom hook that handles preloading of track artwork images
 * to improve user experience when navigating through tracks.
 */
export default function useImagePreloader() {
  /**
   * Preloads images for a list of tracks
   * @param tracksToPreload Array of tracks whose images should be preloaded
   */
  const preloadImages = useCallback((tracksToPreload: Track[]) => {
    tracksToPreload.forEach((track) => {
      if (track) {
        const img = new window.Image();
        img.src = getImageUrl(track);
      }
    });
  }, []);

  return preloadImages;
}