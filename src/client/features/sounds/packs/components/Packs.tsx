// src\client\features\sounds\category\components\Packs.tsx
/**
* @fileoverview Packs component for displaying and playing track collections
* @module sounds/category/Packs
*/

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Track } from "@/shared/types/track";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faArrowLeft,
 faArrowRight,
 faPlay,
 faStop,
} from "@fortawesome/free-solid-svg-icons";
import Artwork from "@components/common/Artwork";

/**
* Props interface for Packs component
*/
interface PacksProps {
 tracks: Track[];
}

/**
* Packs component displaying grid of playable tracks
* Includes pagination, playback controls, and responsive layout
*/
const Packs: React.FC<PacksProps> = ({ tracks }) => {
 // Playback state
 const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
 const [isPlaying, setIsPlaying] = useState(false);
 const [playbackPosition, setPlaybackPosition] = useState<number>(0);
 const audioRef = React.useRef<HTMLAudioElement>(null);

 // Pagination state
 const [currentPage, setCurrentPage] = useState(0);
 const [itemsPerPage, setItemsPerPage] = useState(6);
 const [hoverIndex, setHoverIndex] = useState<number | null>(null);
 const totalPages = Math.ceil(tracks?.length / itemsPerPage);

 /**
  * Handles play/pause toggle for tracks
  */
 const togglePlayPause = (track: Track) => {
   if (track !== currentTrack) {
     setCurrentTrack(track);
     setIsPlaying(true);
     setPlaybackPosition(0);
   } else if (isPlaying) {
     setIsPlaying(false);
     setPlaybackPosition(audioRef.current?.currentTime || 0);
     audioRef.current?.pause();
   } else {
     setIsPlaying(true);
     if (audioRef.current) {
       audioRef.current.currentTime = playbackPosition;
       audioRef.current.play().catch((error) => console.error("Play error:", error));
     }
   }
 };

 /**
  * Manages audio playback when track or state changes
  */
 useEffect(() => {
   const audio = audioRef.current;
   const currentTrackFile = currentTrack?.file;

   if (audio && currentTrackFile) {
     const audioSrc = `/audio/streaming/${currentTrackFile}`;

     if (audio.src !== audioSrc) {
       audio.src = audioSrc;
       audio.load();
     }

     if (isPlaying) {
       audio.currentTime = playbackPosition;
       audio.play().catch((error) => console.error("Play error:", error));
     } else {
       audio.pause();
     }
   }

   return () => {
     if (audio) {
       audio.pause();
     }
   };
 }, [currentTrack, isPlaying, playbackPosition]);

 /**
  * Pagination handlers
  */
 const handleNext = useCallback(() => {
   setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
 }, [totalPages]);

 const handlePrevious = useCallback(() => {
   setCurrentPage((prev) => Math.max(prev - 1, 0));
 }, []);

 /**
  * Utility for rendering track values
  */
 const renderValue = (value: string) => {
   return value && value !== "n/a" && value !== "" ? value : null;
 };

 /**
  * Memoized slice of tracks for current page
  */
 const displayedTracks = useMemo(() => {
   return tracks?.slice(
     currentPage * itemsPerPage,
     (currentPage + 1) * itemsPerPage
   );
 }, [tracks, currentPage, itemsPerPage]);

 /**
  * Handles responsive layout and keyboard navigation
  */
 useEffect(() => {
   // Update items per page based on screen size
   const updateItemsPerPage = () => {
     if (window.innerWidth > 1280) setItemsPerPage(6);
     else if (window.innerWidth > 1024) setItemsPerPage(5);
     else if (window.innerWidth > 768) setItemsPerPage(4);
     else if (window.innerWidth > 640) setItemsPerPage(15);
   };

   // Keyboard navigation handler
   const handleKeyDown = (event: KeyboardEvent) => {
     switch (event.key) {
       case "ArrowLeft": handlePrevious(); break;
       case "ArrowRight": handleNext(); break;
     }
   };

   // Set up event listeners
   updateItemsPerPage();
   window.addEventListener("resize", updateItemsPerPage);
   window.addEventListener("keydown", handleKeyDown);

   return () => {
     window.removeEventListener("resize", updateItemsPerPage);
     window.removeEventListener("keydown", handleKeyDown);
   };
 }, [currentPage, handlePrevious, handleNext]);

  return (
    <div className="w-full flex justify-center items-center ">
      <audio
        key={currentTrack?.id}
        className="hidden"
        src={`/audio/streaming/${currentTrack?.file}`}
        controls
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
        }}
      />
      <div className="w-full xl:w-4/5 flex flex-col items-center justify-between">
        <div className="container mx-auto">
          {/* Header and Navigation */}
          <div className="w-full flex items-center justify-between mb-4 px-4">
            <h1 className="font-custom text-neutral-800 dark:text-white text-2xl md:text-3xl">
              What&apos;s New
            </h1>
            <Link
              className="text-sm px-3 py-1.5 rounded-full font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-300 dark:text-white  dark:bg-neutral-800 dark:hover:bg-neutral-900 md:hidden"
              href="/sounds"
            >
              See All
            </Link>
            <div className="hidden md:block space-x-4">
              <button
                onClick={handlePrevious}
                className={`w-8 h-8 rounded-full ${
                  currentPage === 0
                    ? "bg-neutral-300 dark:bg-neutral-900"
                    : "bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-900"
                }`}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size="xs"
                  className="text-white"
                />
              </button>
              <button
                onClick={handleNext}
                className={`w-8 h-8 rounded-full ${
                  currentPage === totalPages - 1
                    ? "bg-neutral-900"
                    : "bg-neutral-800 hover:bg-neutral-900"
                }`}
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size="xs"
                  className="text-white"
                />
              </button>
            </div>
          </div>

          {/* Album Cover Cards */}
          <div className="w-full flex items-center justify-center mb-2 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-0 sm:space-x-4 xl:space-x-6 px-0 overflow-x-scroll scrollbar-hide w-full">
              {displayedTracks?.map((track, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="flex-grow w-60  rounded-lg md:bg-neutral-200 md:hover:bg-neutral-300 dark:md:bg-neutral-900 dark:md:hover:bg-neutral-800 relative snap-start"
                >
                  <div className="w-36 md:w-auto flex items-center justify-center relative m-0 mr-3 md:m-3 aspect-ratio-1/1 user-select-none">
                    <Artwork
                      catalog={track?.metadata?.catalog}
                      fallback="default"
                      alt={track.metadata.title}
                      width={160}
                      height={160}
                      className="rounded-md user-select-none"
                      loading="lazy"
                    />
                    <button
                      className={`absolute w-10 h-10 bottom-2 right-2 rounded-full p-2 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-500 ${
                        hoverIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={() => {
                        togglePlayPause(track);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={isPlaying && currentTrack === track ? faStop : faPlay}
                        size="lg"
                        color="white"
                        className={isPlaying && currentTrack === track ? "ml-0" : "ml-1"}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-900 dark:text-white text-base mt-2 hover:underline hover:cursor-pointer mx-0 md:mx-4">
                    {track.metadata.title}
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs hover:underline hover:cursor-pointer overflow-x-auto w-28 mt-0 md:mx-4 mb-4">
                    {renderValue(track.info.relatedartist[1])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packs;
