/**
 * @fileoverview Sounds page for music discovery and playback
 * @module pages/sounds
 */

"use client";
import React, { useState, useEffect } from "react";
import { Track } from "@/shared/types/track";
import { usePlayer } from "@/client/features/player/services/playerService";
import { useTracks } from "@/client/features/tracks";

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
    setTrackList, 
    togglePlay, 
    audioRef,
    playTrack
  } = usePlayer();

  // Track and filter contexts
  const { tracks } = useTracks();
  const { filteredTracks } = useFilterContext();
  const { openSidebar, userClosedSidebar } = useRightSidebar();

  // Handle track selection with sidebar behavior
  const handleTrackPlay = React.useCallback((selectedTrack: Track) => {
    // Play the track using context method
    playTrack(selectedTrack);
    
    // Open sidebar unless explicitly closed
    if (!userClosedSidebar) {
      openSidebar();
    }
  }, [playTrack, openSidebar, userClosedSidebar]);

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
          playTrack={handleTrackPlay}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />

        {/* Desktop filter */}
        <DesktopFilter />

        {/* Track catalogs */}
        <DesktopCatalog
          tracks={filteredTracks}
          playTrack={handleTrackPlay}
          onTitleClick={handleTrackPlay}
        />
        <MobileCatalog
          tracks={filteredTracks}
          playTrack={handleTrackPlay}
          onTitleClick={handleTrackPlay}
        />
      </div>
    </div>
  );
};

export default Sounds;