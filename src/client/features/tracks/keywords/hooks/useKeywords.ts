// src\client\features\tracks\keywords\hooks\useKeywords.ts
import { useMemo } from "react";
import { useTracksContext } from "@/client/features/tracks/services";
import { extractUniqueKeywords } from "@tracks/keywords/utils";

/**
 * Custom hook to fetch and extract unique keywords from track data.
 * 
 * This hook leverages the TracksContext to retrieve tracks and memoizes 
 * the keyword extraction to prevent unnecessary recomputations.
 * 
 * @returns {{ keywords: string[] | undefined }} Object containing the keywords array
 */
export const useKeywords = () => {
  const { tracks } = useTracksContext();

  // Memoize keyword extraction to prevent unnecessary recomputations
  const keywords = useMemo(() => {
    return tracks.length > 0 ? extractUniqueKeywords(tracks) : undefined;
  }, [tracks]);

  return { keywords };
};