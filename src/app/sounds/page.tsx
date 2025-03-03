/**
 * @fileoverview Sounds page for music discovery and playback
 * @module pages/sounds
 */

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { usePlayer } from "@/client/features/player/services/playerService";
import { useTracks } from "@/client/features/tracks";
import { Track } from "@/shared/types/track";

import { Hero } from "@sounds/hero";
import { Category } from "@sounds/category/layout";
import { MobileCatalog, DesktopCatalog, NewTracks } from "@sounds/catalog/components";
import { MobileFilter, DesktopFilter } from "@sounds/filters/layout";
import { useRightSidebar } from "@layout/rightbar/context";
import { useFilterContext } from '@sounds/filters/context';

/**
 * Sounds Component:
 * - Manages audio playback and track selection
 * - Handles UI interactions for track browsing and playing
 */
const Sounds: React.FC = () => {
  // Local mounting state to prevent SSR rendering issues
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Access player context and methods
  const { 
    currentTrack, 
    isPlaying, 
    setCurrentTrack, 
    setTrackList, 
    togglePlay, 
    audioRef 
  } = usePlayer();

  // Track and filter contexts
  const { tracks } = useTracks();
  const { filteredTracks } = useFilterContext();
  const { openSidebar, userClosedSidebar } = useRightSidebar();

  // Manage track selection and playback
  const playTrack = useCallback(
    (selectedTrack: Track) => {
      // Prevent rapid track switching
      const audioElement = audioRef.current;
      if (!audioElement) return;

      // If same track, toggle play/pause
      if (currentTrack && selectedTrack.id === currentTrack.id) {
        togglePlay();
      } else {
        // Set new track and ensure it plays
        setCurrentTrack(selectedTrack);
      }

      // Open sidebar unless explicitly closed
      if (!userClosedSidebar) {
        openSidebar();
      }
    },
    [
      currentTrack, 
      setCurrentTrack, 
      togglePlay, 
      audioRef, 
      openSidebar, 
      userClosedSidebar
    ]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Update track list when filtered tracks change
  useEffect(() => {
    if (filteredTracks.length > 0) {
      setTrackList(filteredTracks);
    }
  }, [filteredTracks, setTrackList]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="md:h-full overflow-y-scroll rounded-t-xl">
        {/* Mobile filter */}
        <MobileFilter />

        {/* Hero section with playback controls */}
        <Hero
          audioRef={audioRef}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          togglePlayPause={togglePlay}
        />

        {/* Category selector */}
        <Category />

        {/* New tracks display */}
        <NewTracks
          tracks={tracks}
          playTrack={playTrack}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />

        {/* Desktop filter */}
        <DesktopFilter />

        {/* Track catalogs */}
        <DesktopCatalog
          tracks={filteredTracks}
          playTrack={playTrack}
          onTitleClick={playTrack}
        />
        <MobileCatalog
          tracks={filteredTracks}
          playTrack={playTrack}
          onTitleClick={playTrack}
        />
      </div>
    </div>
  );
};

export default Sounds;