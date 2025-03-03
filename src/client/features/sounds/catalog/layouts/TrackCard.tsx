// src\client\features\sounds\catalog\components\TrackCard.tsx

"use client";

import React, { useState, useCallback } from "react";
import { Track } from "@/shared/types/track";
import { Artwork, Watermark } from "@components/common";
import { PlayerIcons } from '@/client/shared/components/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useResponsiveLayout from "@/client/features/sounds/catalog/hooks/useResponsiveLayout";
import { getImageUrl } from "@/client/features/sounds/catalog/utils/trackUtils";
import useImagePreloader from "@/client/features/sounds/catalog/hooks/useImagePreloader";

/**
 * Props definition for the TrackCard component.
 */
export interface TrackCardProps {
  tracks: Track[]; // List of tracks to display
  currentTrack?: Track; // The currently playing track
  playTrack: (track: Track) => void; // Function to play a selected track
  isPlaying: boolean; // Boolean indicating if a track is currently playing
}

/**
 * A card-based track display component with pagination and playback controls.
 */
const TrackCard: React.FC<TrackCardProps> = ({
  tracks,
  currentTrack,
  playTrack,
  isPlaying,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  // Get responsive layout data
  const { isMobile, itemsPerPage } = useResponsiveLayout();
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(tracks.length / itemsPerPage);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const handlePrevious = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }, []);

  // Preload images for smoother navigation
  const preloadImages = useImagePreloader();

  // Determine the tracks to display based on pagination and screen size
  const displayedTracks = isMobile 
    ? tracks // On mobile, show all tracks for horizontal scrolling
    : tracks?.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );
  
  // Preload images for the next page
  React.useEffect(() => {
    if (!isMobile) {
      const nextPage = currentPage + 1;
      const nextPageTracks = tracks.slice(
        nextPage * itemsPerPage,
        (nextPage + 1) * itemsPerPage
      );
      if (nextPageTracks.length > 0) {
        preloadImages(nextPageTracks);
      }
    }
  }, [preloadImages, currentPage, itemsPerPage, tracks, isMobile]);

  // Helper to render values safely
  const renderValue = (value: string) => {
    return value && value !== "n/a" && value !== "" ? value : null;
  };

  return (
    <div className="py-4 max-w-screen-xl w-full mx-auto p-2 pb-0 md:pb-2">
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Main container with 3 divs: prev button, track list, next button */}
        <div className="flex w-full items-center">
          {/* Previous Button - Only visible on desktop */}
          {!isMobile && (
            <NavigationButton 
              direction="previous" 
              onClick={handlePrevious} 
              disabled={currentPage === 0} 
            />
          )}

          {/* Track List */}
          <div className={`flex-1 ${isMobile ? "overflow-x-auto" : "overflow-hidden"} px-2`}>
            <div 
              className={`flex ${
                isMobile 
                  ? "space-x-4 snap-x snap-mandatory" 
                  : "justify-center space-x-4"
              }`}
            >
              {displayedTracks?.map((track, index) => (
                <TrackCardItem
                  key={track.id || index}
                  track={track}
                  isCurrentlyPlaying={isPlaying && currentTrack?.id === track.id}
                  index={index}
                  isMobile={isMobile}
                  onPlay={() => playTrack(track)}
                  onHoverChange={(isHovering) => 
                    setHoverIndex(isHovering ? index : null)
                  }
                  isHovered={hoverIndex === index}
                />
              ))}
            </div>
          </div>

          {/* Next Button - Only visible on desktop */}
          {!isMobile && (
            <NavigationButton 
              direction="next" 
              onClick={handleNext} 
              disabled={currentPage === totalPages - 1} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Navigation button component
interface NavigationButtonProps {
  direction: 'previous' | 'next';
  onClick: () => void;
  disabled: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  direction, onClick, disabled 
}) => (
  <div className="flex-none w-8">
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        disabled
          ? "bg-neutral-100 dark:bg-neutral-900 opacity-50 cursor-not-allowed"
          : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900"
      }`}
      disabled={disabled}
      aria-label={`${direction === 'next' ? 'Next' : 'Previous'} page`}
    >
      <FontAwesomeIcon
        icon={direction === 'next' ? faArrowRight : faArrowLeft}
        size="xs"
        className="text-neutral-600 dark:text-white"
      />
    </button>
  </div>
);

// Individual track card component
interface TrackCardItemProps {
  track: Track;
  isCurrentlyPlaying: boolean;
  index: number;
  isMobile: boolean;
  onPlay: () => void;
  onHoverChange: (isHovering: boolean) => void;
  isHovered: boolean;
}

const TrackCardItem: React.FC<TrackCardItemProps> = ({
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

  // Helper for rendering values safely
  function renderValue(value: string) {
    return value && value !== "n/a" && value !== "" ? value : null;
  }
};

export default TrackCard;