// src\client\features\tracks\index.ts
/**
 * Tracks feature module
 * 
 * This is the main entry point for the tracks feature.
 * It exports components, hooks, and utilities for working with track data.
 * 
 * @module tracks
 */

// Export all types
export type { TrackServiceType, TrackErrorInfo } from './types';

// Export context and provider
export { TracksContext, TracksProvider, useTracksContext } from './services';

// Export core functionality
export { fetchTracks } from './core';

// Export keywords functionality
export {
  useTrackMetadata,
  useKeywords,
  extractUniqueArtists,
  extractUniqueMoods,
  extractUniqueInstruments,
  extractUniqueKeywords,
} from './keywords';

// Export commonly used hooks for convenience
export { useTracksContext as useTracks } from './services/useTracksContext';