"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Track } from "@/shared/types/track";
import Image from "next/image";
import Watermark from "@/client/ui/components/common/Watermark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faArrowRight,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

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

  const displayedTracks = useMemo(() => {
    return tracks?.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [tracks, currentPage, itemsPerPage]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth > 1536) {
        setItemsPerPage(6);
      } else if (window.innerWidth > 1280) {
        setItemsPerPage(15);
      } else if (window.innerWidth > 1024) {
        setItemsPerPage(15);
      } else if (window.innerWidth > 768) {
        setItemsPerPage(15);
      } else if (window.innerWidth > 640) {
        setItemsPerPage(15);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, [currentPage, handlePrevious, handleNext]);

  return (
    <div className="py-4 flex justify-center items-center max-w-screen-xl w-full mx-auto p-2">
      <div className="flex flex-col mx-auto w-full max-w-screen-xl lg:px-2 items-center justify-between">
        <div className="w-full mx-auto">
          {/* Album Cover Cards */}
          <div className="flex w-full justify-between items-center">
            {/* Previous Button */}
            <div className="flex justify-center items-center mr-2 hidden 2xl:block">
              <button
                onClick={handlePrevious}
                className={`w-8 h-8 rounded-full ${
                  currentPage === 0
                    ? "bg-neutral-100 dark:bg-neutral-900"
                    : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900"
                }`}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size="xs"
                  className="text-neutral-600 dark:text-white"
                />
              </button>
            </div>

            {/* Track List with Flex Grow */}
            <div className="flex w-full justify-start space-x-4 px-0">
              {displayedTracks?.map((track, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="flex-start md:w-44 md:h-44 rounded-lg md:bg-neutral-300 md:hover:bg-neutral-300 dark:md:bg-neutral-900 dark:md:hover:bg-neutral-800 relative snap-start"
                >
                  {/* Image and Play Button */}
                  <div className="w-28 h-28 sm:h-36 sm:w-36 md:w-auto flex items-center justify-center relative m-0 mr-0 md:mr-3 md:m-3 aspect-ratio-1/1 user-select-none">
                    <div className="bg-black/80 dark:bg-black/80 p-2 rounded-lg">
                      <Image
                        src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
                          track?.metadata?.catalog ?? "default"
                        }.jpg`}
                        alt={track.metadata.title}
                        width={160}  // Ensures a fixed width
                        height={160} // Ensures a fixed height
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md user-select-none" // Fixed size + Crop/stretch behavior
                      />
                      <button
                        className={`absolute w-8 h-8 bottom-3 right-3 rounded-full p-2 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out bg-neutral-900 hover:bg-neutral-900 dark:bg-blue-700 dark:hover:bg-blue-600 ${
                          hoverIndex === index ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={() => {
                          playTrack(track);
                        }}
                      >
                        <div className="flex justify-center items-center">
                          <FontAwesomeIcon
                            icon={isPlaying && currentTrack === track ? faPause : faPlay}
                            size="sm"
                            color="white"
                          />
                        </div>
                      </button>
                      <Watermark size="md" />
                    </div>
                  </div>

                  {/* Track Info */}
                  <p className="font-medium text-neutral-600 dark:text-white text-sm mt-2 hover:underline hover:cursor-pointer mx-0 md:mx-4 text-left">
                    {track.metadata.title}
                  </p>
                  <p className="text-left text-neutral-500 dark:text-neutral-400 text-xs hover:underline hover:cursor-pointer overflow-x-auto w-28 mt-0 md:mx-4 mb-4">
                    {renderValue(track.info.relatedartist[1])}
                  </p>
                </div>
              ))}
            </div>
              {/* Next Button (Always at the Right) */}
              <div className="flex justify-center items-center ml-2 hidden 2xl:block">
                <button
                  onClick={handleNext}
                  className={`w-8 h-8 rounded-full hidden 2xl:block ${
                    currentPage === totalPages - 1
                      ? "bg-neutral-100 dark:bg-neutral-900"
                      : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="xs"
                    className="text-neutral-600 dark:text-white"
                  />
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
