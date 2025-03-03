// src\client\features\player\types\index.ts
/**
 * @fileoverview Main entry point for the player feature
 * @module features/player
 */

// Re-export the player provider and hook for easier imports
export { PlayerProvider, usePlayer, playerActions } from '../services/playerService';

// Re-export types
export type {
  PlayerState,
  PlayerAction,
  PlayerContextType
} from './contextType';

// Re-export audio service
export { 
  useAudioElement,
  type AudioEventHandlers 
} from '../services/audioService';

// Re-export storage utils
export {
  storePlaybackTime,
  getPlaybackTime,
  resetPlaybackTime
} from '../utils/storage';