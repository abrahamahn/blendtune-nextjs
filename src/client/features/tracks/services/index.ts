// src\client\features\tracks\services\index.ts
/**
 * Tracks context module
 * 
 * Exports the TracksContext and related hooks and types.
 * This serves as the centralized access point for track data across the application.
 * 
 * @module tracks/context
 */

export { TracksContext} from './TracksContext';
export { default as TracksProvider } from './TracksContext';
export { useTracksContext } from './useTracksContext';