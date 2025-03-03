/**
 * @fileoverview Type definitions for player context
 * @module features/player/types/player
 */

import { RefObject } from 'react';
import { Track } from '@/shared/types/track';
import { playerActions } from '../context/playerActions';

/**
 * Player state interface
 * Contains all state managed by the player context
 */
export interface PlayerState {
  currentTrack: Track | undefined;
  isPlaying: boolean;
  trackList: Track[];
  loopedTrackList: Track[];
  loopMode: "off" | "one" | "all";
  isVolumeVisible: boolean;
  currentTime: number;
  trackDuration: number;
  volume: number;
  sharedAudioUrl: string;
}

/**
 * Derive PlayerAction type from the action creators
 * This ensures action types stay in sync with the action creators
 */
export type PlayerAction = 
  | ReturnType<typeof playerActions.setCurrentTrack>
  | ReturnType<typeof playerActions.setIsPlaying>
  | ReturnType<typeof playerActions.setTrackList>
  | ReturnType<typeof playerActions.setLoopedTrackList>
  | ReturnType<typeof playerActions.setLoopMode>
  | ReturnType<typeof playerActions.setIsVolumeVisible>
  | ReturnType<typeof playerActions.setCurrentTime>
  | ReturnType<typeof playerActions.setTrackDuration>
  | ReturnType<typeof playerActions.setVolume>
  | ReturnType<typeof playerActions.setSharedAudioUrl>;

/**
 * PlayerContextType interface
 * Combines state with methods for a complete context definition
 */
export interface PlayerContextType extends PlayerState {
  audioRef: RefObject<HTMLAudioElement | null>;
  dispatch: React.Dispatch<PlayerAction>;
  setCurrentTrack: (track: Track | undefined) => void;
  setTrackList: (tracks: Track[]) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setTrackEndHandler: React.Dispatch<React.SetStateAction<() => void>>;
}