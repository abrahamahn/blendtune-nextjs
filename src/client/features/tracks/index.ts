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
export * from './types';

// Export context and provider
export * from './services';

// Export core functionality
export * from './core';

// Export keywords functionality
export * from './keywords';

// Export commonly used hooks for convenience
export { useTracksContext as useTracks } from './services/useTracksContext';