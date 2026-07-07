// src/client/features/player/types/contextType.ts
import { RefObject } from 'react';
import { Track } from '@/shared/types/track';
import { playerActions } from '../context/playerActions';

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
  playbackError?: { type: string; message: string; recoverable: boolean } | null;
}

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
  | ReturnType<typeof playerActions.setSharedAudioUrl>
  | ReturnType<typeof playerActions.setPlaybackError>;

export interface PlayerContextType extends PlayerState {
  audioRef: RefObject<HTMLAudioElement | null>;
  dispatch: React.Dispatch<PlayerAction>;
  // Accept an optional autoPlay flag for setting a track.
  setCurrentTrack: (track: Track | undefined, autoPlay?: boolean) => void;
  setTrackList: (tracks: Track[]) => void;
  togglePlay: () => void;
  play: () => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setTrackEndHandler: React.Dispatch<React.SetStateAction<() => void>>;
  // Add the missing playTrack function.
  playTrack: (track: Track) => void;
}
