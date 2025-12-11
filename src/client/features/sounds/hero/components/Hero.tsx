// src\client\features\sounds\hero\components\Hero.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faMusic } from "@fortawesome/free-solid-svg-icons";

import { colorExtractor } from "@utils/colorExtractor";
import { Equalizer } from "@player/visualizer/";
import { Watermark, Artwork } from "@/client/shared/components/common";
import { usePlayer } from "@player/services/playerService";
import { usePlayerControls } from "@player/hooks";

/**
 * The Hero component displays the currently playing track with dynamic UI effects.
 */
const Hero: React.FC = () => {
  const { currentTrack, isPlaying, audioRef } = usePlayer();
  const { togglePlayPause } = usePlayerControls();
  const [dominantColor, setDominantColor] = useState("#1E3A8A"); // Stores the dominant color extracted from track artwork
  const equalizerContainerRef = useRef<HTMLDivElement>(null); // Ref for equalizer container

  /**
   * Updates the background color and extracts dominant color from album artwork.
   */
  useEffect(() => {
    const updateBackgroundColor = () => {
      if (typeof window === "undefined") return; // Ensure window is available

      // Set background color based on user system preference
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.style.setProperty(
        "--background-color",
        prefersDarkMode ? "#0A0A0A" : "#fff"
      );

      // Extract color from album artwork
      if (currentTrack) {
        const imageUrl = `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
          currentTrack?.metadata?.catalog ?? "default"
        }.jpg`;

        colorExtractor(imageUrl)
          .then((color) => setDominantColor(color as string))
          .catch((error) =>
            console.error("Error getting dominant color:", error)
          );
      }
    };

    updateBackgroundColor();

    // Listen for system-wide dark mode preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateBackgroundColor);

    return () => {
      mediaQuery.removeEventListener("change", updateBackgroundColor);
    };
  }, [currentTrack]);

  /**
   * Extracts the dominant color from the current track's album artwork.
   */
  useEffect(() => {
    if (!currentTrack) return;

    const imageUrl = `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
      currentTrack?.metadata?.catalog ?? "default"
    }.jpg`;

    colorExtractor(imageUrl)
      .then((color) => setDominantColor(color as string))
      .catch((error) => console.error("Error getting dominant color:", error));
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <div>
      {/* Mobile View (Hero Section) */}
      <div className="block md:hidden mt-[33px] sm:mt-[25px] w-full mx-auto">
        <div
          className="h-full"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${dominantColor}, var(--background-color))`,
          }}
        >
          <div className="max-w-screen-xl flex flex-row justify-center items-center mx-auto px-4 py-0 rounded-md m-0">
            {/* Content Container */}
            <div className="w-full order-2 flex flex-col justify-between p-0 ml-4 h-36 sm:h-44">
              <div className="w-full flex flex-col text-left items-start justify-start h-28 pt-4">
                {/* Title & Play Button */}
                <div className="w-full flex flex-col text-left items-start justify-start">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex justify-start items-start mt-0 sm:mt-[-6px]">
                      {/* Desktop Play Button */}
                      <button
                        className="hidden sm:flex justify-center items-center duration-300 group-hover:opacity-100 cursor-pointer bg-black dark:bg-blue-700 rounded-full w-10 h-10 mr-2 mt-1.5"
                        onClick={togglePlayPause}
                      >
                        <FontAwesomeIcon
                          icon={isPlaying ? faPause : faPlay}
                          size="lg"
                          className="text-white"
                        />
                      </button>

                      {/* Track Title (Mobile & Desktop Variants) */}
                      <p className="sm:hidden text-black dark:text-neutral-200 text-base sm:text-xl text-left font-semibold">
                        {currentTrack?.metadata?.title.toUpperCase()} [
                        {currentTrack?.info?.relatedartist[0]}]
                      </p>
                      <p className="hidden sm:block mt-2 text-black dark:text-neutral-200 text-base sm:text-xl text-left font-semibold">
                        {currentTrack?.metadata?.title.toUpperCase()} [
                        {currentTrack?.info?.relatedartist[0]}, {currentTrack?.info?.mood[0]}]
                      </p>
                    </div>

                    {/* Mood Tag */}
                    <div className="flex justify-end items-end">
                      <p className="hidden sm:block w-auto whitespace-nowrap overflow-hidden font-medium text-2xs sm:text-xs bg-white dark:bg-black text-black dark:text-white py-1 px-2 rounded-full">
                        #{currentTrack?.info?.mood[2]}
                      </p>
                    </div>
                  </div>

                  {/* Producer Name */}
                  <p className="mt-0 sm:mt-2 text-sm text-left text-neutral-600 dark:text-neutral-400">
                    {currentTrack?.metadata?.producer}
                  </p>

                  {/* Track Information (Genre, Key, BPM) */}
                  <div className="flex flex-row flex-wrap items-start justify-start w-full mt-1">
                    {/* Genre Tag */}
                    <p className="font-medium sm:font-bold text-xs text-white dark:text-black bg-black dark:bg-white px-2 rounded-md mr-2">
                      {currentTrack?.info?.genre[0].maingenre}
                    </p>

                    {/* Key & Scale */}
                    <div className="flex flex-row items-center">
                      <FontAwesomeIcon
                        icon={faMusic}
                        size="xs"
                        className="text-black dark:text-white p-0.5"
                      />
                      <p className="text-xs text-black dark:text-white px-1 rounded-md">
                        {currentTrack?.info?.key.note}{" "}
                        {currentTrack?.info?.key.scale
                          .substring(0, 3)
                          .toLowerCase()}
                      </p>
                    </div>

                    {/* BPM */}
                    <div className="flex flex-row items-center ml-2 border border-black dark:border-white rounded-md px-2">
                      <p className="text-xs text-black dark:text-white font-bold">
                        {currentTrack?.info?.bpm} BPM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Equalizer */}
                <div className="w-full flex justify-center h-4 sm:h-8 px-0 mt-6 mx-auto">
                  <div className="w-full" ref={equalizerContainerRef}>
                    <Equalizer audioRef={audioRef} currentTrack={currentTrack} />
                  </div>
                </div>
              </div>
            </div>

            {/* Artwork Container */}
            <div className="flex justify-center items-center order-1">
              <div className="w-28 h-30 sm:w-40 sm:h-40 bg-neutral-200/80 dark:bg-black/80 p-1 sm:p-2 rounded-md relative">
                <div className="relative w-full h-full">
                  {/* Album Artwork */}
                  <Artwork
                    catalog={currentTrack?.metadata?.catalog}
                    fallback="default"
                    alt={currentTrack?.metadata?.title || "Album artwork"}
                    className="w-28 h-30 sm:w-40 h-auto object-cover rounded-md shadow-md cursor-pointer hover:opacity-90 dark:hover:opacity-75"
                    width={150}
                    height={150}
                  />
                  <Watermark size="lg" />

                  {/* Mobile Play Button */}
                  <button
                    className="block sm:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 duration-300 group-hover:opacity-100 cursor-pointer bg-black dark:bg-blue-700 rounded-full w-8 h-8"
                    onClick={togglePlayPause}
                  >
                    <FontAwesomeIcon
                      icon={isPlaying ? faPause : faPlay}
                      size="sm"
                      className="text-white"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
