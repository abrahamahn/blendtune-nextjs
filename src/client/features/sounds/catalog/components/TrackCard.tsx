// src\client\features\sounds\catalog\components\TrackCard.tsx
"use client";

import React, { useState, useCallback } from "react";
import { Track } from "@/shared/types/track";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useResponsiveLayout from "@/client/features/sounds/catalog/hooks/useResponsiveLayout";
import useImagePreloader from "@/client/features/sounds/catalog/hooks/useImagePreloader";
import { usePlayer } from "@/client/features/player/services/playerService";
import TrackCardItem from "@catalog/components/TrackCardItem";
import TrackCardSkeleton from "./TrackCardSkeleton";

/**
 * Props definition for the TrackCard component.
 */
export interface TrackCardProps {
  tracks: Track[]; // List of tracks to display
  currentTrack?: Track; // The currently playing track
  playTrack: (track: Track) => void; // Function to play a selected track
  isLoading?: boolean;
}

/**
 * A card-based track display component with pagination and playback controls.
 */
const TrackCard: React.FC<TrackCardProps> = ({
  tracks,
  playTrack,
  isLoading = false,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { currentTrack, isPlaying } = usePlayer();

  // Get responsive layout data
  const { isMobile, itemsPerPage } = useResponsiveLayout();
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil((tracks?.length || 0) / itemsPerPage);

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
    if (!isMobile && !isLoading && tracks) {
      const nextPage = currentPage + 1;
      const nextPageTracks = tracks.slice(
        nextPage * itemsPerPage,
        (nextPage + 1) * itemsPerPage
      );
      if (nextPageTracks.length > 0) {
        preloadImages(nextPageTracks);
      }
    }
  }, [preloadImages, currentPage, itemsPerPage, tracks, isMobile, isLoading]);

  const renderContent = () => {
    if (isLoading) {
      const skeletonCount = isMobile ? 4 : itemsPerPage;
      return Array.from({ length: skeletonCount }).map((_, index) => (
        <TrackCardSkeleton key={`skeleton-${index}`} isMobile={isMobile} />
      ));
    }

    return displayedTracks?.map((track, index) => (
      <TrackCardItem
        key={track.id || index}
        track={track}
        isCurrentlyPlaying={isPlaying && currentTrack?.id === track.id}
        isMobile={isMobile}
        onPlay={() => playTrack(track)}
        onHoverChange={(isHovering) => 
          setHoverIndex(isHovering ? index : null)
        }
        isHovered={hoverIndex === index}
      />
    ));
  };

  return (
    <div className="py-4 max-w-screen-xl w-full mx-auto p-2 pb-0 md:pb-2">
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Main container with 3 divs: prev button, track list, next button */}
        <div className="flex w-full items-center">
          {/* Previous Button - Only visible on desktop */}
          {!isMobile && !isLoading && (
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
              {renderContent()}
            </div>
          </div>

          {/* Next Button - Only visible on desktop */}
          {!isMobile && !isLoading && (
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

export default TrackCard;