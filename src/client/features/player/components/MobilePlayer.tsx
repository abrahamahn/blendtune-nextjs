// src\client\features\player\components\MobilePlayer.tsx
"use client";
/**
 * @fileoverview Mobile-specific music player component
 * @module features/player/components/MobilePlayer
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Artwork from "@components/common/Artwork";
import { usePlayer } from "@/client/features/player/services/playerService";
import { usePlayerControls } from "../hooks";
import { PlayerIcons } from '@/client/shared/components/icons';
import { useProgressControl } from "../hooks/useProgressControl";

/**
 * Compact player version optimized for mobile screens
 */
export const MobilePlayer: React.FC = () => {
  const { audioRef, currentTrack, currentTime, trackDuration, isPlaying } = usePlayer();
  const { togglePlayPause, nextTrack } = usePlayerControls();
  const { handleProgressClick, progressPercent } = useProgressControl();

  // If no track is playing, don't render the mobile player
  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed px-3 rounded-lg bottom-4 w-full h-14 z-0 block md:hidden">
      <div className="border dark:border-neutral-800 flex flex-col justify-center items-center w-full rounded-lg border-neutral-200 bg-white/90 dark:bg-black/90 overflow-hidden h-full backdrop-blur-md">
        {/* Progress Bar */}
        <div className="w-full" style={{ width: "calc(100% + 11px)" }}>
          <div
            className="w-full border-md bg-black/10 dark:bg-white/10 h-1 rounded-full shadow-xl overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="bg-[#1F1F1F] dark:bg-blue-600 h-1 rounded-md shadow-md w-full transition-width duration-100 ease-in-out"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
        </div>
        {/* Main Controls */}
        <div className="flex items-center justify-start w-full h-full">
          {/* Album Art */}
          <div className="flex items-center justify-center">
            <Artwork
              catalog={currentTrack.metadata?.catalog}
              alt={currentTrack.metadata?.title || "Album artwork"}
              className="h-full object-cover shadow-md"
              width={50}
              height={50}
              loading="lazy"
            />
          </div>
          {/* Text Content: Title/Producer & Key/BPM */}
          <div className="flex items-center justify-between ml-3 flex-grow h-full">
            {/* Left Section: Title and Producer */}
            <div className="flex flex-col">
              <button className="cursor-pointer">
                <p className="text-left text-[#1F1F1F] dark:text-neutral-200 text-sm font-semibold">
                  {currentTrack.metadata?.title.toUpperCase()}
                </p>
              </button>
              <p className="text-xs text-[#707070] dark:text-neutral-400">
                {currentTrack.metadata?.producer}
              </p>
            </div>
            {/* Right Section: Key and BPM */}
            <div className="flex items-center">
              <p className="text-2xs border-[#707070] text-[#F9F9F9] md:text-[#707070] px-2 mr-1 bg-blue-400 dark:bg-blue-500 rounded-md">
                {currentTrack.info?.key?.note}
                {currentTrack.info?.key?.scale.substring(0, 3)}
              </p>
              <p className="text-2xs text-[#F9F9F9] mr-1 bg-blue-500 dark:bg-blue-700 px-2 rounded-md">
                {currentTrack.info?.bpm}BPM
              </p>
            </div>
          </div>
          {/* Control Buttons */}
          <div className="flex flex-row justify-center items-center w-10">
            <button
              className="flex w-10 h-10 items-center justify-center user-select-none p-0"
            >
              <div className="cursor-pointer hover:opacity-75">
                <FontAwesomeIcon
                  icon={faHeart}
                  size="lg"
                  className="cursor-pointer hover:opacity-90 text-[#1F1F1F] dark:text-white"
                />
              </div>
            </button>
          </div>
          <div className="flex flex-row justify-center items-center w-10">
            <button
              className="w-10 items-center justify-center user-select-none p-0"
              onClick={togglePlayPause}
            >
              <div className="cursor-pointer hover:opacity-90">
                <PlayerIcons.PlayPause 
                  isPlaying={isPlaying} 
                  size="lg"
                  className="text-black dark:text-white"
                />
              </div>
            </button>
          </div>
          <div className="flex flex-row justify-center items-center w-10">
            <button
              className="flex w-10 h-10 items-center justify-center user-select-none p-0"
              onClick={nextTrack}
            >
              <div className="cursor-pointer hover:opacity-90">
                <PlayerIcons.Forward 
                  size="lg" 
                  onClick={nextTrack} 
                  className="text-black dark:text-white"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayer;
