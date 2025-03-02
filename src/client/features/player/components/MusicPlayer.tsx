/**
 * @fileoverview Main music player component orchestrating the player UI and functionality
 * @module features/player/components/MusicPlayer
 */

"use client";
import React from "react";
import { usePlayer } from "@/client/features/player/services/playerService";
import { useKeyboardShortcuts, useVolumeControl } from "../hooks";

import PlayerControls from "./PlayerControls";
import VolumeControl from "./VolumeControl";
import TrackInfo from "./TrackInfo";
import TrackProgress from "./TrackProgress";
import MobilePlayer from "./MobilePlayer";

/**
 * Main music player component
 * Orchestrates audio playback, controls, and visualization
 */
const MusicPlayer: React.FC = () => {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  
  // Get volume wheel handler
  const { handleVolumeWheel } = useVolumeControl();

  return (
    <div onWheelCapture={handleVolumeWheel}>
      {/* DESKTOP PLAYER */}
      <div className="hidden md:block fixed bottom-0 left-0 w-full flex justify-center items-center">
        <div className="flex flex-row items-center justify-center w-full h-20 border-t dark:border-neutral-800 bg-white dark:bg-transparent border-neutral-300 backdrop-blur-md lg:px-6 px-0">
          {/* Playback Controls */}
          <PlayerControls />

          {/* Track Progress and Volume */}
          <div className="flex flex-row w-1/2 h-full items-center px-4">
            <TrackProgress />
            <VolumeControl />
          </div>

          {/* Track Info & Action Buttons */}
          <TrackInfo />
        </div>
      </div>

      {/* MOBILE PLAYER */}
      <MobilePlayer />
    </div>
  );
};

export default MusicPlayer;