// src/app/sounds/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "@player/hooks";
import { useTracks } from "@/client/features/sounds/tracks/core/hooks";
import {
  setCurrentTrack,
  setIsPlaying,
  setTrackList,
} from "@store/slices";
import { RootState } from "@core/store";
import { Hero } from "@sounds/hero";
import { Category } from "@sounds/category/layout";
import { MobileCatalog, DesktopCatalog, NewTracks } from "@/client/features/sounds/catalog/components";
import { MobileFilter, DesktopFilter } from "@/client/features/sounds/filters/layout";
import { useRightSidebar } from "@layout/rightbar/context";
import { FilterProvider, useFilterContext } from '@features/sounds/filters/context';
import { Track } from "@/shared/types/track";


/**
 * Sounds Component:
 * - Manages the audio playback and filtering system.
 * - Handles UI interactions for track selection and filtering.
 */
const Sounds: React.FC = () => {
  // Local state for mounting and track filtering
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dispatch = useDispatch();
  const { audioRef } = useAudio();
  const { tracks } = useTracks();

  // Global state from Redux for current track and playback status
  const currentTrack = useSelector(
    (state: RootState) => state.audio.playback.currentTrack as Track | undefined
  );
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );

  // Sidebar state control
  const { openSidebar, userClosedSidebar } = useRightSidebar();

  // Local state to manage filtered tracks and play/pause throttling
  const { filteredTracks } = useFilterContext();


  /**
   * Toggles play/pause state while preventing rapid clicking.
   */
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);

    if (isPlaying) {
      audioRef.current.pause();
      dispatch(setIsPlaying(false));
    } else {
      audioRef.current
        .play()
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing the track:", error);
          }
        });
      dispatch(setIsPlaying(true));
    }
  }, [audioRef, isPlaying, dispatch, isTransitioning]);

  /**
   * Handles track playback.
   * - If the same track is selected, toggles play/pause.
   * - Otherwise, loads and plays the new track.
   */
  const playTrack = useCallback(
    (selectedTrack: Track) => {
      if (!audioRef.current || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 100);

      if (currentTrack && selectedTrack.id === currentTrack.id) {
        togglePlayPause();
      } else {
        dispatch(setCurrentTrack(selectedTrack));
        const audioElement = audioRef.current;
        if (audioElement) {
          audioElement.src = `/audio/tracks/${selectedTrack.file}`;
          audioElement.addEventListener(
            "loadeddata",
            () => {
              audioElement.play().catch(console.error);
              dispatch(setIsPlaying(true));
            },
            { once: true }
          );
          audioElement.load();
        }
      }

      // Open sidebar when track is played unless explicitly closed
      if (!userClosedSidebar) {
        openSidebar();
      }
    },
    [currentTrack, dispatch, audioRef, openSidebar, userClosedSidebar, isTransitioning, togglePlayPause]
  );

  /**
   * Opens sidebar and plays a track when its title is clicked.
   */
  const handleTitleClick = useCallback(
    (selectedTrack: Track) => {
      if (!userClosedSidebar) {
        openSidebar();
      }
      playTrack(selectedTrack);
    },
    [playTrack, openSidebar, userClosedSidebar]
  );

  // Dispatch the sorted track list to Redux global state whenever it changes.
  useEffect(() => {
    if (filteredTracks.length > 0) {
      dispatch(setTrackList(filteredTracks));
    }
  }, [filteredTracks, dispatch]);

  if (!isMounted) return null;

    /**
   * Renders the UI components only after mounting.
   * Ensures the app does not interact with the DOM before hydration.
   */
    return isMounted ? (
      <div className="flex flex-col h-full w-full">
        <div className="md:h-full overflow-y-scroll rounded-t-xl">
          {/* Mobile filter component */}
          <MobileFilter />
  
          {/* Hero section: controls main playback */}
          <Hero
            audioRef={audioRef}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
          />
  
          {/* Category selector */}
          <Category />
  
          {/* Display new tracks */}
          <NewTracks
            tracks={tracks}
            playTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
  
          {/* Desktop filter component */}
          <DesktopFilter />
  
          {/* Desktop track catalog */}
          <DesktopCatalog
            tracks={filteredTracks}
            playTrack={playTrack}
            onTitleClick={handleTitleClick}
          />
  
          {/* Mobile track catalog */}
          <MobileCatalog
            tracks={filteredTracks}
            playTrack={playTrack}
            onTitleClick={handleTitleClick}
          />
        </div>
      </div>
    ) : (
      <></>
    );
  };
  
  export default Sounds;