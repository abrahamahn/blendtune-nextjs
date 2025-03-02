/**
 * @fileoverview Utility functions for localStorage operations
 * @module features/player/utils/storage
 */

/**
 * Store current track playback time in localStorage
 * 
 * @param trackId - ID of the current track
 * @param time - Current playback time in seconds
 */
export const storePlaybackTime = (trackId: number, time: number): void => {
  localStorage.setItem(`track-${trackId}-time`, time.toString());
};

/**
 * Reset playback time for a track
 * 
 * @param trackId - ID of the track
 */
export const resetPlaybackTime = (trackId: number): void => {
  localStorage.setItem(`track-${trackId}-time`, "0");
};

/**
 * Get stored playback time for a track
 * 
 * @param trackId - ID of the track
 * @returns Stored playback time in seconds or 0 if not found
 */
export const getPlaybackTime = (trackId: number): number => {
  const savedTime = localStorage.getItem(`track-${trackId}-time`);
  if (!savedTime) return 0;
  
  const parsedTime = parseFloat(savedTime);
  return isNaN(parsedTime) ? 0 : parsedTime;
};