// src\client\features\player\context\playerTypes.ts
/**
 * @fileoverview Type definitions for the player context
 * @module features/player/context/playerTypes
 */

import { Dispatch } from 'react';
import { Track } from '@/shared/types/track';

/**
 * Player state interface representing the entire audio player state
 * Tracks current track, playback status, volume, and other player-related information
 */
export interface PlayerState {
  currentTrack?: Track;  // Currently playing track
  isPlaying: boolean;    // Whether audio is currently playing
  trackList: Track[];    // List of tracks in current playlist
  loopedTrackList: Track[]; // Tracks in loop playlist
  loopMode: "off" | "one" | "all"; // Current loop mode
  isVolumeVisible: boolean; // Volume control visibility
  currentTime: number;   // Current playback time
  trackDuration: number; // Total track duration
  volume: number;        // Current volume level (0-1)
  sharedAudioUrl: string; // URL of current audio source
}

/**
 * Defines all possible actions that can modify the player state
 * Uses discriminated union for type-safe state updates
 */
export type PlayerAction =
  | { type: 'SET_CURRENT_TRACK'; payload: Track | undefined }
  | { type: 'SET_IS_PLAYING'; payload: boolean }
  | { type: 'SET_TRACK_LIST'; payload: Track[] }
  | { type: 'SET_LOOPED_TRACK_LIST'; payload: Track[] }
  | { type: 'SET_LOOP_MODE'; payload: "off" | "one" | "all" }
  | { type: 'SET_IS_VOLUME_VISIBLE'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_TRACK_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_SHARED_AUDIO_URL'; payload: string };

/**
 * Extends PlayerState with method for dispatching actions and managing audio
 * Provides a comprehensive interface for player context consumption
 */
export interface PlayerContextType extends PlayerState {
  audioRef: React.RefObject<HTMLAudioElement>;
  dispatch: Dispatch<PlayerAction>;
  setCurrentTrack: (track: Track | undefined) => void;
  setTrackList: (tracks: Track[]) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setTrackEndHandler: React.Dispatch<React.SetStateAction<() => void>>;
}