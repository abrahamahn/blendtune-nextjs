import React from "react";
import { Track } from "@/shared/types/track";
import { Artwork, Watermark } from "@components/common"; // Adjust imports as needed
import { PlayerIcons } from "@/client/shared/components/icons"; // Adjust imports as needed
import { renderValue } from "@/client/features/sounds/catalog/utils/trackUtils";

/**
 * Props definition for the TrackCardItem component.
 */
export interface TrackCardItemProps {
  track: Track;
  isCurrentlyPlaying: boolean;
  isMobile: boolean;
  onPlay: () => void;
  onHoverChange: (isHovered: boolean) => void;
  isHovered: boolean;
}

// Function to get image URL that works with either imageUrl property or constructs from catalog
const getImageUrl = (track: Track): string => {
  return `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${track?.metadata?.catalog ?? "default"}.jpg`;
};

const TrackCardItem = React.memo<TrackCardItemProps>(({
  track,
  isCurrentlyPlaying,
  isMobile,
  onPlay,
  onHoverChange,
  isHovered
}) => {
  return (
    <div
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className={`
        flex-none md:w-40 md:h-54 rounded-lg
        bg-transparent dark:bg-transparent 
        md:hover:bg-[#F0F0F0] hover:bg-transparent
        md:bg-[#F9F9F9] dark:md:bg-neutral-900 dark:md:hover:bg-neutral-800
        relative 
        ${isMobile ? "snap-start" : ""}
      `}
    >
      {/* Image and Play Button */}
      <div className="w-30 h-30 sm:h-36 sm:w-36 md:w-auto flex items-center justify-center relative m-0 mr-0 md:mr-3 md:m-3">
        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-black/20 dark:bg-black/80 p-2 dark:p-2 rounded-lg">
          <Artwork
            srcOverride={getImageUrl(track)}
            alt={track.metadata.title}
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md user-select-none"
          />
          <button
            className={`absolute w-8 h-8 bottom-3 right-3 rounded-full p-2 z-10 transition-opacity duration-300 ease-in-out bg-neutral-900 dark:bg-blue-700 dark:hover:bg-blue-600 ${
              isHovered || isCurrentlyPlaying
                ? "opacity-100"
                : "opacity-0"
            }`}
            onClick={onPlay}
          >
            <div className="flex justify-center items-center">
              <PlayerIcons.PlayPause 
                isPlaying={isCurrentlyPlaying} 
                size="sm" 
                className="text-white"
              />
            </div>
          </button>
          <Watermark size="md" />
        </div>
      </div>

      {/* Track Info */}
      <p className="font-medium text-neutral-600 dark:text-white text-sm mt-2 hover:underline hover:cursor-pointer mx-0 md:mx-4 text-left truncate">
        {track.metadata.title}
      </p>
      <p className="text-left text-neutral-500 dark:text-neutral-400 text-xs hover:underline hover:cursor-pointer truncate w-full mt-0 md:mx-4 mb-4">
        {renderValue(track.info.relatedartist[1])}
      </p>
    </div>
  );
});

// Add display name to fix potential ESLint error
TrackCardItem.displayName = 'TrackCardItem';

export default TrackCardItem;