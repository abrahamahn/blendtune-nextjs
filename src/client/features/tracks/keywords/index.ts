// src\client\features\tracks\keywords\index.ts
/**
 * Entry point for keywords feature
 * Provides utilities for extracting and managing track metadata
 * 
 * @module sounds/keywords
 */

// Export hooks for metadata management
export { useTrackMetadata, useKeywords } from './hooks';

// Export utilities for direct extraction
export {
  extractUniqueArtists,
  extractUniqueMoods,
  extractUniqueInstruments,
  extractUniqueKeywords,
} from './utils';