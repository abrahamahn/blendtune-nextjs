// src\client\features\tracks\services\useTracksContext.ts
import { useContext } from "react";
import { TracksContext } from './TracksContext';

/**
 * Custom hook for accessing the tracks context.
 * 
 * Provides type-safe access to track data, loading state and errors from the TracksContext.
 * Throws an error if used outside of a TracksProvider.
 * 
 * @returns The tracks context value including tracks, loading state and error information
 * @throws {Error} If used outside a TracksProvider
 */
export const useTracksContext = () => {
  const context = useContext(TracksContext);

  if (context === undefined) {
    throw new Error("useTracksContext must be used within a TracksProvider");
  }

  return context;
};