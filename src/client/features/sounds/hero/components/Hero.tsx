// src\client\features\sounds\hero\components\Hero.tsx

"use client";

import React, { useState, useEffect, useRef, RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faMusic } from "@fortawesome/free-solid-svg-icons";
import { Track } from "@/shared/types/track";
import Image from "next/image";

import { colorExtractor } from "@utils/colorExtractor";
import Equalizer from "@visualizer/components/Equalizer";
import { Watermark } from "@components/common";

/**
 * Props definition for the Hero component.
 */
interface HeroProps {
  currentTrack?: Track; // Currently playing track
  isPlaying: boolean; // Playback state
  audioRef: RefObject<HTMLAudioElement | null>; // Reference to the audio element
  togglePlayPause: () => void; // Function to toggle play/pause
}

/**
 * The Hero component displays the currently playing track with dynamic UI effects.
 */
const Hero: React.FC<HeroProps> = ({
  currentTrack,
  isPlaying,
  audioRef,
  togglePlayPause,
}) => {
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
                        {currentTrack?.info?.relatedartist[0]},{" "}
                        {currentTrack?.info?.mood[0]}]
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
                    <Equalizer
                      audioRef={audioRef}
                      currentTrack={currentTrack}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Artwork Container */}
            <div className="flex justify-center items-center order-1">
              <div className="w-28 h-30 sm:w-40 sm:h-40 bg-neutral-200/80 dark:bg-black/80 p-1 sm:p-2 rounded-md relative">
                <div className="relative w-full h-full">
                  {/* Album Artwork */}
                  <Image
                    crossOrigin="anonymous"
                    src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
                      currentTrack?.metadata?.catalog ?? "default"
                    }.jpg`}
                    alt={currentTrack?.metadata?.title ?? ""}
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
      {/* Tablet View (Hero Section) */}
      <div className="hidden md:block lg:hidden mt-12 md:mt-0 w-full mx-auto md:pb-4">
        <div
          className="pb-0 md:pb-4 h-full"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${dominantColor}, var(--background-color))`,
          }}
        >
          <div className="max-w-screen-xl flex flex-row justify-center items-center mx-auto p-4 pb-4 sm:pb-0 px-4 sm:px-4 md:px-4 lg:px-12 lg:pl-8 rounded-md m-0">
            {/* Content Container */}
            <div className="w-full order-2 md:order-1 flex flex-col justify-between p-0 lg:px-4 ml-4 md:ml-0 h-36 sm:h-44 md:h-56 lg:h-72">
              <div className="w-full flex flex-col items-start justify-center h-full md:pb-8">
                <div className="w-full flex flex-col text-left items-start justify-start">
                  {/* Title & Mood Tags */}
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex justify-start items-start mt-0">
                      {/* Play Button */}
                      <button
                        className="hidden sm:flex justify-center items-center duration-300 group-hover:opacity-100 cursor-pointer bg-black dark:bg-blue-700 rounded-full w-10 h-10 mr-2 mt-1.5"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <FontAwesomeIcon icon={faPause} size="lg" className="text-white" />
                        ) : (
                          <FontAwesomeIcon icon={faPlay} size="lg" className="text-white" />
                        )}
                      </button>


                      {/* Track Title */}
                      <p className="md:mt-0 text-black dark:text-neutral-200 text-base sm:text-xl md:text-3xl text-left font-semibold">
                        {currentTrack?.metadata?.title.toUpperCase()} [
                        {currentTrack?.info?.mood[1]},{" "}
                        {currentTrack?.info?.mood[0]}]
                      </p>
                    </div>

                    {/* Mood Tag */}
                    <div className="flex justify-end items-end">
                      <p className="hidden lg:block w-auto whitespace-nowrap overflow-hidden font-medium text-2xs sm:text-xs md:text-sm bg-white dark:bg-black text-black dark:text-white py-1 px-2 rounded-full mr-0">
                        #{currentTrack?.info?.mood[2]}
                      </p>
                    </div>
                  </div>

                  {/* Producer Name */}
                  <p className="mt-2 md:mt-0 lg:mt-1 font-semibold text-sm md:text-lg lg:text-xl text-left text-neutral-800 dark:text-white">
                    {currentTrack?.metadata?.producer}
                  </p>
                </div>

                {/* Basic Track Information (Genre, Key, BPM) */}
                <div className="flex flex-col items-start justify-between w-full mt-2">
                  <div className="flex flex-row justify-start mb-2">
                    {/* Genre Tag */}
                    <p className="font-medium sm:font-bold text-xs md:text-xs text-white dark:text-black bg-black dark:bg-white px-2 rounded-md mr-2">
                      {currentTrack?.info?.genre[0].maingenre}
                    </p>

                    {/* Key & Scale */}
                    <div className="flex flex-row">
                      <FontAwesomeIcon
                        icon={faMusic}
                        size="xs"
                        className="text-black dark:text-white p-0.5"
                      />
                      <p className="text-xs md:text-xs text-black dark:text-white px-1 rounded-md">
                        {currentTrack?.info?.key.note}{" "}
                        {currentTrack?.info?.key.scale
                          .substring(0, 3)
                          .toLowerCase()}
                      </p>
                    </div>

                    {/* BPM */}
                    <div className="flex flex-row ml-2">
                      <p className="flex justify-center items-center border border-black dark:border-white rounded-md px-1 text-black dark:text-white text-3xs font-bold">
                        BPM
                      </p>
                      <p className="text-xs md:text-xs text-black dark:text-white mr-1 px-1 ml-0.5">
                        {currentTrack?.info?.bpm}
                      </p>
                    </div>
                  </div>

                  {/* Related Artists */}
                  <div className="w-full flex flex-row justify-start">
                    {[
                      currentTrack?.info?.relatedartist[0],
                      currentTrack?.info?.relatedartist[1],
                      currentTrack?.info?.relatedartist[2],
                    ].map(
                      (artist, i) =>
                        artist && (
                          <p
                            key={i}
                            className={`${
                              i === 2 ? "hidden sm:block" : ""
                            } flex justify-center items-center w-auto whitespace-nowrap overflow-hidden font-medium text-2xs sm:text-xs md:text-xs bg-white dark:bg-black text-black dark:text-white py-1 px-2 rounded-full mr-1`}
                          >
                            {artist}
                          </p>
                        )
                    )}
                    </div>
                  </div>
                </div>
                {/* Equalizer Visualization (Centered at Bottom) */}
                <div className="w-full md:w-full md:max-w-screen-xl flex justify-center h-4 sm:h-8 lg:h-8 px-0 md:pr-4 lg:px-0.5 lg:mt-4 md:h-12 mt-0 mx-auto">
                  <div className="w-full" ref={equalizerContainerRef}>
                    <Equalizer 
                      audioRef={audioRef} 
                      currentTrack={currentTrack}
                    />
                  </div>
                </div>
              </div>

              {/* Album Artwork & Play Button */}
              <div className="flex justify-center items-center md:order-2 order-1">
                {/* Artwork Container */}
                <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-auto bg-neutral-200/80 dark:bg-black/80 p-1 sm:p-2 rounded-md relative">
                  <div className="relative w-full h-full">
                    {/* Displaying Album Cover Image */}
                    <Image
                      crossOrigin="anonymous"
                      src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
                        currentTrack?.metadata?.catalog ?? "default"
                      }.jpg`}
                      alt={currentTrack?.metadata?.title ?? ""}
                      className="w-36 sm:w-40 md:w-56 lg:w-72 lg:h-72 h-auto object-cover rounded-md shadow-md cursor-pointer hover:opacity-90 dark:hover:opacity-75"
                      width={150}
                      height={150}
                    />
                    {/* Branding Watermark (e.g., logo or small branding text) */}
                    <Watermark size="lg" />

                    {/* Mobile Play Button (Appears only on small screens) */}
                    <button
                      className="block sm:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 duration-300 group-hover:opacity-100 cursor-pointer bg-black dark:bg-blue-700 rounded-full w-8 h-8"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <FontAwesomeIcon
                          icon={faPause}
                          size="sm"
                          className="text-white"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faPlay}
                          size="sm"
                          className="text-white"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div> {/* End of Track Metadata + Album Artwork Section */}
          </div>
        </div>
      </div>
  );
};

export default Hero;