// src\client\features\sounds\tracks\components\TrackCard.tsx
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Track } from "@/shared/types/track";
import Image from "next/image";
import Watermark from "@components/common//Watermark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

// Helper function defined outside the component.
function getImageUrl(track: Track): string {
  return `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${track?.metadata?.catalog ?? "default"}.jpg`;
}

interface TrackCardProps {
  tracks: Track[];
  currentTrack?: Track;
  playTrack: (track: Track) => void;
  isPlaying: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({
  tracks,
  currentTrack,
  playTrack,
  isPlaying,
}) => {
  // Pagination Functions
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const totalPages = Math.ceil(tracks?.length / itemsPerPage);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const handlePrevious = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }, []);

  const renderValue = (value: string) => {
    return value && value !== "n/a" && value !== "" ? value : null;
  };

  // Preload images for a given set of tracks.
  const preloadImages = useCallback((tracksToPreload: Track[]) => {
    tracksToPreload.forEach((track) => {
      const img = new window.Image();
      img.src = getImageUrl(track);
    });
  }, []);

  // Determine displayed tracks based on mobile or desktop view
  const displayedTracks = useMemo(() => {
    if (isMobile) {
      // On mobile, show all tracks for horizontal scrolling
      return tracks;
    } else {
      // On desktop, paginate tracks
      return tracks?.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );
    }
  }, [tracks, currentPage, itemsPerPage, isMobile]);

  // Adjust itemsPerPage and check if mobile based on window width
  useEffect(() => {
    const updateLayout = () => {
      // Check if mobile view (under 1024px)
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Set items per page for desktop view
      if (!mobile) {
        if (window.innerWidth > 1536) {
          setItemsPerPage(6); // 2xl screens
        } else if (window.innerWidth > 1280) {
          setItemsPerPage(5); // xl screens
        } else {
          setItemsPerPage(4); // lg screens
        }
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  // Preload images for the next page (if available) so they show up immediately
  useEffect(() => {
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

  return (
    <div className="py-4 max-w-screen-xl w-full mx-auto p-2 pb-0 md:pb-2">
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Main container with 3 divs: prev button, track list, next button */}
        <div className="flex w-full items-center">
          {/* Previous Button - Only visible on desktop */}
          {!isMobile && (
            <div className="flex-none w-8">
              <button
                onClick={handlePrevious}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === 0
                    ? "bg-neutral-100 dark:bg-neutral-900 opacity-50 cursor-not-allowed"
                    : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900"
                }`}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size="xs"
                  className="text-neutral-600 dark:text-white"
                />
              </button>
            </div>
          )}

          {/* Track List - Takes up all available space between buttons */}
          <div className={`flex-1 ${isMobile ? "overflow-x-auto" : "overflow-hidden"} px-2`}>
            <div 
              className={`flex ${
                isMobile 
                  ? "space-x-4 snap-x snap-mandatory" 
                  : "justify-center space-x-4"
              }`}
            >
              {displayedTracks?.map((track, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
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
                      <Image
                        crossOrigin="anonymous"
                        src={getImageUrl(track)}
                        alt={track.metadata.title}
                        width={160}
                        height={160}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md user-select-none"
                      />
                      <button
                        className={`absolute w-8 h-8 bottom-3 right-3 rounded-full p-2 z-10 transition-opacity duration-300 ease-in-out bg-neutral-900 dark:bg-blue-700 dark:hover:bg-blue-600 ${
                          hoverIndex === index || (isPlaying && currentTrack === track) 
                            ? "opacity-100" 
                            : "opacity-0"
                        }`}
                        onClick={() => {
                          playTrack(track);
                        }}
                      >
                        <div className="flex justify-center items-center">
                          <FontAwesomeIcon
                            icon={
                              isPlaying && currentTrack === track
                                ? faPause
                                : faPlay
                            }
                            size="sm"
                            color="white"
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
              ))}
            </div>
          </div>

          {/* Next Button - Only visible on desktop */}
          {!isMobile && (
            <div className="flex-none w-8">
              <button
                onClick={handleNext}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === totalPages - 1
                    ? "bg-neutral-100 dark:bg-neutral-900 opacity-50 cursor-not-allowed"
                    : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900"
                }`}
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size="xs"
                  className="text-neutral-600 dark:text-white"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;