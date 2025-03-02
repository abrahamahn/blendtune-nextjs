/**
 * @fileoverview Utility functions for time formatting
 * @module features/player/utils/formatTime
 */

/**
 * Formats time in seconds to MM:SS format
 * @param timeInSeconds - Time to format in seconds
 * @returns Formatted time string
 */
export function formatTime(timeInSeconds: number | undefined): string {
  if (typeof timeInSeconds !== "number" || isNaN(timeInSeconds)) {
    return "0:00";
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}