import React from "react";
import { PlayerIcons } from '@/client/shared/components/icons';
import { usePlayer } from "@/client/features/player/services/playerService";
import { useTrackNavigation } from "../hooks";

export const PlayerControls: React.FC = () => {
  const { isPlaying, loopMode } = usePlayer();
  const { togglePlayPause, previousTrack, nextTrack, loopTrack } = useTrackNavigation();

  return (
    <div className="flex flex-row w-32 md:w-48 h-full items-center justify-center">
      <div className="items-center mr-4 p-2">
        <PlayerIcons.Backward 
          onClick={previousTrack} 
          className="text-black dark:text-white"
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
          <PlayerIcons.PlayPause 
            isPlaying={isPlaying} 
            size="xl" 
            className="text-black dark:text-white"
          />
        </div>
      </button>
      <div className="items-center p-2 ml-4">
        <PlayerIcons.Forward 
          onClick={nextTrack} 
          className="text-black dark:text-white"
        />
      </div>
      <button
        className="relative items-center p-2 ml-4 cursor-pointer focus:outline-none focus:ring-0"
        onClick={loopTrack}
      >
        <PlayerIcons.Repeat 
          loopMode={loopMode} 
          onClick={loopTrack} 
          className="text-black dark:text-white"
        />
      </button>
    </div>
  );
};

export default PlayerControls;