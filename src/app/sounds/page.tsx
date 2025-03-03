// src\client\features\sounds\pages\Sounds.tsx

"use client";
import React, { useState, useEffect } from "react";
import { usePlayer } from "@/client/features/player/services/playerService";
import { useTracks } from "@/client/features/tracks";

import { Hero } from "@sounds/hero";
import { Category } from "@sounds/category/layout";
import { NewTracks } from "@sounds/catalog/layouts";
import { CatalogProvider } from "@sounds/catalog";
import { MobileFilter, DesktopFilter } from "@sounds/filters/layout";
import { useFilterContext } from '@sounds/filters/context';
import { MobileCatalog, DesktopCatalog } from "@sounds/catalog";
import { Track } from "@shared/types/track";

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

  // Update track list when filtered tracks change
  useEffect(() => {
    if (filteredTracks.length > 0) {
      setTrackList(filteredTracks);
    }
  }, [filteredTracks, setTrackList]);

  // Handler for playing tracks
  const handlePlayTrack = (track: Track) => {
    playTrack(track);
  };

  // Handler for track title clicks
  const handleTitleClick = (track: Track) => {
    // Implement title click behavior if needed
    console.log("Track title clicked:", track.metadata.title);
  };

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
        <NewTracks />

        {/* Desktop filter */}
        <DesktopFilter />

        {/* Catalog with actual children components */}
        <CatalogProvider tracks={filteredTracks}>
          <div>
            {/* Mobile catalog view */}
            <MobileCatalog 
              tracks={filteredTracks} 
              playTrack={handlePlayTrack}
              onTitleClick={handleTitleClick}
            />
            
            {/* Desktop catalog view */}
            <DesktopCatalog 
              tracks={filteredTracks} 
              playTrack={handlePlayTrack}
              onTitleClick={handleTitleClick}
            />
          </div>
        </CatalogProvider>
      </div>
    </div>
  );
};

export default Sounds;