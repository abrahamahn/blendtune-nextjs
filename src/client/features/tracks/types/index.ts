/**
 * @fileoverview Type definitions for tracks context
 * @module features/tracks/types
 */

import { Track } from '@/shared/types/track';

/**
 * Basic Track Service interface
 * Defines the core properties for track management
 */
export interface TrackServiceType {
  tracks: Track[];
}

/**
 * Extended Track Error information
 */
export interface TrackErrorInfo {
  message: string;
  code: string;
}