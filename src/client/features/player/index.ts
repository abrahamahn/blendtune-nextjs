/**
 * @fileoverview Entry point for the player feature
 * @module features/player
 */

// Export the main player component
export { MusicPlayer } from './components';

// Export the player provider
export { PlayerProvider } from './services/playerService';

// Export hooks for external use
export {
  useTrackNavigation,
  useVolumeControl,
  useKeyboardShortcuts
} from './hooks';

// Export types
export type { PlayerState, PlayerContextType } from './context';

export { playerActions } from './context/playerActions';
