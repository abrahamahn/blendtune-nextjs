// src\client\features\player\context\playerActions.ts
/**
 * @fileoverview Action creators for player state management
 * @module features/player/context/playerActions
 */

import { Track } from '@/shared/types/track';

export const playerActions = {
  /**
   * Create an action to set the current track
   * @param payload The track to be set as current, or undefined
   */
  setCurrentTrack: (payload: Track | undefined) => ({ 
    type: 'SET_CURRENT_TRACK' as const, 
    payload 
  }),

  /**
   * Create an action to toggle playing state
   * @param payload Boolean indicating whether audio is playing
   */
  setIsPlaying: (payload: boolean) => ({ 
    type: 'SET_IS_PLAYING' as const, 
    payload 
  }),

  /**
   * Create an action to set the entire track list
   * @param payload Array of tracks
   */
  setTrackList: (payload: Track[]) => ({ 
    type: 'SET_TRACK_LIST' as const, 
    payload 
  }),

  /**
   * Create an action to set looped track list
   * @param payload Array of tracks in loop playlist
   */
  setLoopedTrackList: (payload: Track[]) => ({ 
    type: 'SET_LOOPED_TRACK_LIST' as const, 
    payload 
  }),

  /**
   * Create an action to set loop mode
   * @param payload Loop mode: 'off', 'one', or 'all'
   */
  setLoopMode: (payload: "off" | "one" | "all") => ({ 
    type: 'SET_LOOP_MODE' as const, 
    payload 
  }),

  /**
   * Create an action to toggle volume control visibility
   * @param payload Boolean indicating if volume control is visible
   */
  setIsVolumeVisible: (payload: boolean) => ({ 
    type: 'SET_IS_VOLUME_VISIBLE' as const, 
    payload 
  }),

  /**
   * Create an action to update current playback time
   * @param payload Current time in seconds
   */
  setCurrentTime: (payload: number) => ({ 
    type: 'SET_CURRENT_TIME' as const, 
    payload 
  }),

  /**
   * Create an action to set track duration
   * @param payload Total track duration in seconds
   */
  setTrackDuration: (payload: number) => ({ 
    type: 'SET_TRACK_DURATION' as const, 
    payload 
  }),

  /**
   * Create an action to set volume level
   * @param payload Volume level between 0 and 1
   */
  setVolume: (payload: number) => ({ 
    type: 'SET_VOLUME' as const, 
    payload 
  }),

  /**
   * Create an action to set the shared audio URL
   * @param payload URL of the audio source
   */
  setSharedAudioUrl: (payload: string) => ({ 
    type: 'SET_SHARED_AUDIO_URL' as const, 
    payload 
  }),

  /**
   * Create an action to set a playback error for robust error handling
   * @param payload Error details including type, message, and recoverability
   */
  setPlaybackError: (payload: { 
    type: string; 
    message: string; 
    recoverable: boolean; 
  }) => ({
    type: 'SET_PLAYBACK_ERROR' as const,
    payload,
  }),
};
