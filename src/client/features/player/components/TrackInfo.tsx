/**
 * @fileoverview Component to display current track information and metadata
 * @module features/player/components/TrackInfo
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Artwork from "@components/common/Artwork";
import { usePlayer } from "@/client/features/player/services/playerService";

/**
 * Displays track artwork, metadata, and action buttons
 */
export const TrackInfo: React.FC = () => {
  const { currentTrack } = usePlayer();

  if (!currentTrack) {
    return (
      <div className="flex items-center h-full w-full max-w-90 justify-center">
        <p className="text-neutral-500 dark:text-neutral-400">No track selected</p>
      </div>
    );
  }

  return (
    <div className="flex items-center h-full w-full max-w-90 justify-center">
      {/* Album Art */}
      <div className="relative h-12 w-12 lg:h-16 lg:w-16 dark:bg-black/70 bg-neutral-90/70 rounded-md ml-2">
        <div className="flex items-center justify-center h-12 w-12 lg:h-16 lg:w-16 ml-0 rounded-md p-0.5 md:p-0.5">
          <Artwork
            catalog={currentTrack.metadata?.catalog}
            alt={currentTrack.metadata?.title || "Album artwork"}
            className="w-full h-full object-cover rounded-md shadow-md cursor-pointer hover:opacity-75"
            width={64}
            height={64}
            loading="lazy"
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="flex flex-col justify-center p-4 min-w-40 max-w-40 lg:min-w-60 lg:max-w-60 h-full">
        <div className="flex flex-col">
          <button className="cursor-pointer text-left">
            <p
              className="text-neutral-600 dark:text-neutral-200 text-xs lg:text-sm font-semibold mb-2 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {currentTrack.metadata?.title.toUpperCase()}
              {/* Extra details only show on medium screens and above */}
              <span className="hidden md:inline">
                {" ["}
                {currentTrack.info?.mood?.[1]}, {currentTrack.info?.relatedartist?.[0]}
                {"]"}
              </span>
            </p>
          </button>
        </div>
        <div className="flex flex-row space-x-2">
          <p className="text-2xs text-neutral-500 dark:text-white px-2 border border-neutral-500 dark:border-neutral-500 rounded-md">
            {currentTrack.info?.key?.note} {currentTrack.info?.key?.scale.substring(0, 3).toLowerCase()}
          </p>
          <p className="text-2xs text-neutral-500 dark:text-neutral-200 bg-transparent dark:bg-neutral-500/50 rounded-md w-14 text-center border border-neutral-500 dark:border-transparent">
            {currentTrack.info?.bpm} BPM
          </p>
          <p className="hidden lg:flex items-center justify-center text-2xs bg-blue-600 dark:bg-blue-600 text-white rounded-md w-12 text-center">
            {currentTrack.info?.genre[0]?.maingenre}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row justify-center items-center w-16 lg:w-28 h-full space-x-2">
        <div className="w-8 h-8 flex items-center justify-center p-2 rounded-full cursor-pointer hover:opacity-75">
          <FontAwesomeIcon icon={faPlus} className="text-[#6D6D6D] dark:text-white" />
        </div>
        <div className="w-8 h-8 flex items-center justify-center p-2 rounded-full cursor-pointer hover:opacity-75">
          <FontAwesomeIcon icon={faHeart} className="text-[#6D6D6D] dark:text-white" />
        </div>
        <div className="w-8 h-8 flex items-center justify-center p-2 rounded-full cursor-pointer hover:opacity-75">
          <FontAwesomeIcon icon={faEllipsisVertical} className="text-[#6D6D6D] dark:text-white" />
        </div>
      </div>
    </div>
  );
};

export default TrackInfo;