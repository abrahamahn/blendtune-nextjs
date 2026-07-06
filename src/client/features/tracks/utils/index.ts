// src\client\features\tracks\utils\index.ts
/**
 * Tracks utility functions
 * 
 * Provides helper functions and utilities for track operations
 * 
 * @module tracks/utils
 */

export {
  TrackErrorCode,
  setErrorLogger,
  TrackError,
  isTrackError,
  handleTrackError,
  createFetchError,
  createPlaybackError,
  createMetadataError,
} from './errors';