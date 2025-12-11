// src\client\features\layout\rightbar\components\InnerLayer.tsx
/**
* @fileoverview InnerLayer component for right sidebar displaying track details and visualizer
* @module layout/rightbar/InnerLayer
*/

"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { Equalizer } from "@player/visualizer/";
import { colorExtractor } from "@utils/colorExtractor";
import { Artwork, Watermark } from "@components/common/";
import { TrackMetadata } from "@layout/rightbar/components/TrackMetadata";
import { SimpleTrackProgress } from "@layout/rightbar/components/SimpleTrackProgress";
import InnerLayerSkeleton from "./InnerLayerSkeleton";

/**
* InnerLayer component providing track details and audio visualization
*/
const InnerLayer: React.FC = () => {
  const { 
    audioRef, 
    currentTrack, 
    currentTime, 
    trackDuration, 
    dispatch 
  } = usePlayer();

  // Theme and color state
  const [themePreference, setThemePreference] = useState("dark");
  const [dominantColor, setDominantColor] = useState("#000000");

  // Equalizer dimensions
  const equalizerContainerRef = useRef<HTMLDivElement>(null);
  const [equalizerWidth, setEqualizerWidth] = useState(0);

  // Theme and color effect
  useEffect(() => {
    const updateThemePreferenceAndColor = () => {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemePreference(prefersDarkMode ? "dark" : "light");

      if (currentTrack) {
        const imageUrl = `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
          currentTrack?.metadata?.catalog ?? "default"
        }.jpg`;

        colorExtractor(imageUrl)
          .then((color) => setDominantColor(color as string))
          .catch((error) => console.error("Error getting dominant color:", error));
      }
    };

    updateThemePreferenceAndColor();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateThemePreferenceAndColor);

    return () => mediaQuery.removeEventListener("change", updateThemePreferenceAndColor);
  }, [currentTrack]);

  // Equalizer resize effect
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setEqualizerWidth(entry.contentRect.width);
      }
    });

    if (equalizerContainerRef.current) {
      resizeObserver.observe(equalizerContainerRef.current);
      setEqualizerWidth(equalizerContainerRef.current.offsetWidth);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Audio time update effect
  useEffect(() => {
    const handleTimeUpdate = () => {
      dispatch(playerActions.setCurrentTime(audioRef.current?.currentTime || 0));
    };

    const handleLoadedMetadata = () => {
      dispatch(playerActions.setTrackDuration(audioRef.current?.duration || 0));
    };

    const currentAudioRef = audioRef.current;
    currentAudioRef?.addEventListener("timeupdate", handleTimeUpdate);
    currentAudioRef?.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      currentAudioRef?.removeEventListener("timeupdate", handleTimeUpdate);
      currentAudioRef?.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [dispatch, audioRef]);

  // Handle progress bar click to seek
  const handleProgressBarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const durationBar = e.currentTarget;
    const rect = durationBar.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const newPercentage = (mouseX / rect.width) * 100;
    const newPlaybackPosition = trackDuration
      ? (newPercentage / 100) * trackDuration
      : 0;
    if (audioRef.current) {
      audioRef.current.currentTime = newPlaybackPosition;
    }
  };

  if (!currentTrack) {
    return <InnerLayerSkeleton />;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-auto p-2 pl-1">
      {/* Main container with dynamic background */}
      <div
        className="p-0 rounded-2xl h-full border dark:border-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${dominantColor}, ${themePreference === "light" ? "#ffffff" : "#000000"})`,
        }}
      >
        {/* Track details section */}
        <div className="flex flex-col p-8 pt-4 rounded-md m-0 mt-0 lg:mt-2">
          {/* Artwork container */}
          <div className="flex justify-center mt-0 p-0">
            <div className="w-56 h-56 bg-neutral-200/80 dark:bg-black/80 p-2 rounded-md relative">
              <Artwork
                catalog={currentTrack?.metadata?.catalog}
                alt={currentTrack?.metadata?.title || "Artwork"}
                className="w-56 h-auto object-cover rounded-lg shadow-md cursor-pointer hover:opacity-75"
                width={200}
                height={200}
                priority
              />
              <Watermark size="xl" />
            </div>
          </div>

          {/* Track information */}
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="flex flex-col text-neutral-600 dark:text-white text-center">
              <p className="text-neutral-800 dark:text-neutral-200 text-lg font-semibold">
                {currentTrack?.metadata.title.toUpperCase()} [
                {currentTrack?.info?.mood[1]},{" "}
                {currentTrack?.info?.relatedartist[0]}]
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {currentTrack?.metadata?.producer}
              </p>
            </div>

            {/* Track metadata badges */}
            <div className="flex mt-0.5">
              <p className="font-bold text-xs md:text-xs text-white dark:text-black bg-black dark:bg-white px-2 rounded-md mr-2">
                {currentTrack?.info?.genre[0].maingenre}
              </p>
              <div className="flex flex-row">
                <FontAwesomeIcon
                  icon={faMusic}
                  size="xs"
                  className="text-black dark:text-white p-0.5"
                />
                <p className="text-xs md:text-xs text-black dark:text-white px-1 rounded-md">
                  {currentTrack?.info?.key.note}{" "}
                  {currentTrack?.info?.key.scale.substring(0, 3).toLowerCase()}
                </p>
              </div>
              <div className="flex flex-row ml-2">
                <p className="flex justify-center items-center border border-black dark:border-white rounded-md px-1 text-black dark:text-white text-3xs font-bold">
                  BPM
                </p>
                <p className="text-xs md:text-xs text-black dark:text-white mr-1 px-1 ml-0.5">
                  {currentTrack?.info?.bpm}
                </p>
              </div>
            </div>
          </div>

          {/* Audio visualizer */}
          <div className="w-full h-8 mt-3 block rounded-md">
            <div className="w-full h-8" ref={equalizerContainerRef}>
              <Equalizer
                audioRef={audioRef}
                currentTrack={currentTrack}
              />
            </div>
          </div>

          {/* Simple Track Progress component */}
          <SimpleTrackProgress 
            audioRef={audioRef}
            currentTime={currentTime}
            trackDuration={trackDuration}
            onProgressClick={handleProgressBarClick}
          />

          {/* Detailed track information */}
          <div className="w-full mt-4 border-b pb-1">
            <p className="text-neutral-500 dark:text-white">Track Details</p>
          </div>
          
          {/* Track metadata component */}
          <TrackMetadata currentTrack={currentTrack} />
        </div>

        {/* Similar tracks section */}
        <div className="px-4">
          <div className="flex flex-col p-2 rounded-md mt-2 h-20">
            <p className="text-neutral-500 dark:text-white">Sounds Similar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerLayer;