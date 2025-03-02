// src\client\features\tracks\types.ts
import { Track } from "@/shared/types/track";

/**
 * Defines the structure of the TrackService context.
 */
export interface TrackServiceType {
  tracks: Track[]; // List of available tracks
}

/**
 * Extended track data with additional client-side properties
 */
export interface EnhancedTrack extends Track {
  /**
   * Flag indicating if the track is currently playing
   */
  isPlaying?: boolean;
  
  /**
   * Flag indicating if the track is currently selected
   */
  isSelected?: boolean;
  
  /**
   * Client-specific unique identifier
   */
  clientId?: string;
}

/**
 * Available sorting options for tracks
 */
export type TrackSortOption = 
  | "newest" 
  | "oldest" 
  | "title-asc" 
  | "title-desc" 
  | "bpm-asc" 
  | "bpm-desc";

/**
 * Track loading states
 */
export type TrackLoadingState = 
  | "idle" 
  | "loading" 
  | "succeeded" 
  | "failed";

/**
 * Track filter criteria
 */
export interface TrackFilterCriteria {
  /**
   * Genre to filter by
   */
  genre?: string[];
  
  /**
   * Category to filter by
   */
  category?: string;
  
  /**
   * Artist to filter by
   */
  artist?: string[];
  
  /**
   * BPM range to filter by
   */
  bpm?: {
    min: number;
    max: number;
  };
  
  /**
   * Keywords to filter by
   */
  keywords?: string[];
  
  /**
   * Mood to filter by
   */
  mood?: string[];
  
  /**
   * Key to filter by
   */
  key?: {
    note: string;
    scale: string;
  };
}

/**
 * Track service state
 */
export interface TrackServiceState {
  /**
   * All available tracks
   */
  tracks: Track[];
  
  /**
   * Currently filtered tracks
   */
  filteredTracks: Track[];
  
  /**
   * Currently selected track
   */
  selectedTrack: Track | null;
  
  /**
   * Current loading state
   */
  loadingState: TrackLoadingState;
  
  /**
   * Error message if loading failed
   */
  error: string | null;
  
  /**
   * Current sort option
   */
  sortBy: TrackSortOption;
  
  /**
   * Current filter criteria
   */
  filterCriteria: TrackFilterCriteria;
}

export type{ Track } from '@/shared/types/track';