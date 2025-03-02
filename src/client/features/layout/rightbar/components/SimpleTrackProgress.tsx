/**
 * @fileoverview Simple track progress component for sidebar
 * @module layout/rightbar/components/SimpleTrackProgress
 */

import React from "react";
import { formatTime } from "@player/utils";

interface SimpleTrackProgressProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentTime: number;
  trackDuration: number;
  onProgressClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Simple track progress bar with timestamps for sidebar
 * Shares functionality with the main player but with simplified UI
 */
export const SimpleTrackProgress: React.FC<SimpleTrackProgressProps> = ({
  audioRef,
  currentTime,
  trackDuration,
  onProgressClick,
}) => {
  return (
    <>
      {/* Playback progress bar */}
      <div className="flex w-full h-full items-center justify-center mt-1">
        <button
          className="w-full border-md bg-black/10 dark:bg-white/10 h-1 rounded-full shadow-xl overflow-hidden cursor-pointer"
          onClick={onProgressClick}
        >
          <div
            className="bg-black/40 dark:bg-white h-1 rounded-md shadow-md w-full transition-width duration-100 ease-in-out cursor-pointer"
            style={{
              width: `${(currentTime / (trackDuration ?? 1)) * 100}%`,
            }}
          />
        </button>
      </div>

      {/* Timestamps */}
      <div className="text-xs mt-1 w-full h-full flex items-center justify-between user-select-none">
        <p className="text-black/60 dark:text-white">
          {formatTime(currentTime)}
        </p>
        <p className="text-neutral-500">{formatTime(trackDuration)}</p>
      </div>
    </>
  );
};