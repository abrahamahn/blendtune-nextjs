/**
 * @fileoverview Component that handles player control buttons (play/pause, next, previous, loop)
 * @module features/player/components/PlayerControls
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faRepeat,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "@/client/features/player/services/playerService";
import { useTrackNavigation } from "../hooks";

/**
 * Renders playback control buttons for music player
 */
export const PlayerControls: React.FC = () => {
  const { isPlaying, loopMode } = usePlayer();
  const { togglePlayPause, previousTrack, nextTrack, loopTrack } = useTrackNavigation();

  const playPauseButton = isPlaying ? (
    <FontAwesomeIcon icon={faPause} size="xl" className="text-[#1F1F1F] dark:text-white" />
  ) : (
    <FontAwesomeIcon icon={faPlay} size="xl" className="ml-0.5 text-[#1F1F1F] dark:text-white" />
  );

  return (
    <div className="flex flex-row w-32 md:w-48 h-full items-center justify-center">
      <div className="items-center mr-4 p-2">
        <FontAwesomeIcon
          icon={faBackwardStep}
          size="lg"
          onClick={previousTrack}
          className="cursor-pointer hover:opacity-75 text-[#1F1F1F] dark:text-white"
        />
      </div>
      <button
        className="flex rounded-full w-10 h-10 items-center justify-center user-select-none"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          togglePlayPause();
        }}
      >
        <div className="cursor-pointer hover:opacity-75 text-[#070707] dark:text-white">
          {playPauseButton}
        </div>
      </button>
      <div className="items-center p-2 ml-4">
        <FontAwesomeIcon
          icon={faForwardStep}
          size="lg"
          onClick={nextTrack}
          className="cursor-pointer hover:opacity-75 text-[#1F1F1F] dark:text-white"
        />
      </div>
      <button
        className="relative items-center p-2 ml-4 cursor-pointer focus:outline-none focus:ring-0"
        onClick={loopTrack}
      >
        <FontAwesomeIcon
          icon={faRepeat}
          size="sm"
          className={`cursor-pointer hover:opacity-75 ${loopMode !== "off" ? "text-blue-500" : "text-[#1F1F1F] dark:text-white"}`}
        />
        {loopMode !== "off" && (
          <p className="absolute bottom-1 right-0 text-2xs text-blue-500">
            {loopMode === "one" ? "1" : "all"}
          </p>
        )}
      </button>
    </div>
  );
};

export default PlayerControls;