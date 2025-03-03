// src\client\features\player\context\playerReducer.ts
/**
 * @fileoverview Reducer function for player state management
 * @module features/player/context/playerReducer
 */

import { PlayerState, PlayerAction } from './playerTypes';

/**
 * Initial state for the player
 * Provides default values for all player-related state
 */
export const initialPlayerState: PlayerState = {
  currentTrack: undefined,     // No track initially selected
  isPlaying: false,            // Not playing by default
  trackList: [],               // Empty track list
  loopedTrackList: [],         // Empty looped track list
  loopMode: "all",             // Default loop mode
  isVolumeVisible: false,      // Volume control hidden
  currentTime: 0,              // No playback time
  trackDuration: 0,            // No track duration
  volume: 1,                   // Maximum volume
  sharedAudioUrl: "",          // No audio source
};

/**
 * Player reducer function
 * Handles all state updates in a pure, predictable way
 * @param state Current player state
 * @param action Action to be applied to the state
 * @returns Updated player state
 */
export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    
    case 'SET_IS_PLAYING':
      return { ...state, isPlaying: action.payload };
    
    case 'SET_TRACK_LIST':
      return { ...state, trackList: action.payload };
    
    case 'SET_LOOPED_TRACK_LIST':
      return { ...state, loopedTrackList: action.payload };
    
    case 'SET_LOOP_MODE':
      return { ...state, loopMode: action.payload };
    
    case 'SET_IS_VOLUME_VISIBLE':
      return { ...state, isVolumeVisible: action.payload };
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    
    case 'SET_TRACK_DURATION':
      return { ...state, trackDuration: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    
    case 'SET_SHARED_AUDIO_URL':
      return { ...state, sharedAudioUrl: action.payload };
    
    default:
      return state;
  }
}