"use client";
import React, { useState, useEffect, useRef, RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faMusic } from "@fortawesome/free-solid-svg-icons";
import { Track } from "@/types/track";
import { AudioContextType } from "@/context/AudioContext";
import Image from "next/image";

import { colorExtractor } from "@/utils/ColorExtractor";
import Equalizer from "@/components/shared/visualizer/Equalizer";
import Watermark from "@/components/shared/common/Watermark";

interface HeroProps {
  currentTrack?: Track;
  isPlaying: boolean;
  audioRef: RefObject<HTMLAudioElement>;
  togglePlayPause: () => void;
}

const Hero: React.FC<HeroProps> = ({
  currentTrack,
  isPlaying,
  audioRef,
  togglePlayPause,
}) => {
  const equalizerContainerRef = useRef<HTMLDivElement>(null);
  const [equalizerWidth, setEqualizerWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Assuming you want the width
        const { width } = entry.contentRect;
        setEqualizerWidth(width);
      }
    });

    if (equalizerContainerRef.current) {
      resizeObserver.observe(equalizerContainerRef.current);
      // Initialize equalizerWidth with the initial width
      setEqualizerWidth(equalizerContainerRef.current.offsetWidth);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateBackgroundColor = () => {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.style.setProperty(
        "--background-color",
        prefersDarkMode ? "#0A0A0A" : "#fff"
      );

      if (currentTrack) {
        const imageUrl = `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
          currentTrack?.metadata?.catalog ?? "default"
        }.jpg`;

        colorExtractor(imageUrl)
          .then((color) => {
            setDominantColor(color as string);
          })
          .catch((error) => {
            console.error("Error getting dominant color:", error);
          });
      }
    };
    // Check if the code is running in the browser environment (window is available)
    if (typeof window !== "undefined") {
      updateBackgroundColor();

      // Add event listener for changes in system-wide color scheme preference
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", updateBackgroundColor);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (typeof window !== "undefined") {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .removeEventListener("change", updateBackgroundColor);
      }
    };
  }, [currentTrack]);

  const [dominantColor, setDominantColor] = useState("#1E3A8A");
  useEffect(() => {
    if (!currentTrack) {
      return;
    }

    const imageUrl = `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
      currentTrack?.metadata?.catalog ?? "default"
    }.jpg`;

    colorExtractor(imageUrl)
      .then((color) => {
        setDominantColor(color as string);
      })
      .catch((error) => {
        console.error("Error getting dominant color:", error);
      });
  }, [currentTrack]);

  return (
    <div className="block lg:hidden pt-16 md:pt-0 xl:pt-0 w-full mx-auto md:pb-4">
      <div
        className="pt-8 sm:pt-4 md:pt-16 pb-0 h-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${dominantColor}, var(--background-color))`,
        }}
      >
        <div className="max-w-screen-xl flex flex-row justify-center items-center mx-auto p-0 sm:p-4 lg:p-4 pb-4 sm:pb-0 px-4 sm:px-4 md:px-4 lg:px-12 lg:pl-8 rounded-md m-0 ">
          <div className="w-full order-2 md:order-1 flex flex-col  justify-between p-0 lg:px-4 ml-4 md:ml-0 h-36 sm:h-44 md:h-56 lg:h-72 mt-[-10px]">
            <div className="w-full flex flex-col items-start justify-center h-full lg:pb-20">
              <div className="w-full flex flex-col text-left items-start justify-start">
                <div className="w-full flex flex-row justify-between"></div>
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex justify-start items-start mt-0 md:mt-[-45px]">
                    <button
                      className="hidden sm:flex justify-center items-center duration-300 group-hover:opacity-100 cursor-pointer bg-black dark:bg-blue-700 rounded-full w-8 h-8 lg:w-10 lg:h-10 mr-2 md:mr-3 mt-1.5 lg:mt-0.5"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <FontAwesomeIcon
                          icon={faPause}
                          size="lg"
                          className="text-white"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faPlay}
                          size="lg"
                          className="text-white"
                        />
                      )}
                    </button>

                    <p className="mt-1.5 md:mt-0 text-black dark:text-neutral-200 text-base sm:text-xl md:text-3xl text-left font-semibold">
                      {currentTrack?.metadata?.title.toUpperCase()} [
                      {currentTrack?.info?.mood[1]},{" "}
                      {currentTrack?.info?.mood[0]}]
                    </p>
                  </div>
                  <div className="flex justify-end items-end">
                    <p className="hidden lg:block justify-end items-end w-auto whitespace-nowrap overflow-hidden font-medium text-2xs sm:text-xs md:text-sm bg-white dark:bg-black text-black dark:text-white py-1 px-2 rounded-full mr-0">
                      #{currentTrack?.info?.mood[2]}
                    </p>
                  </div>
                </div>

                <p className="mt-2 md:mt-0 lg:mt-1 font-semibold text-sm md:text-lg lg:text-xl text-left text-neutral-800  dark:text-white">
                  {currentTrack?.metadata?.producer}
                </p>
              </div>
              <div className="flex flex-col items-start justify-between w-full mt-2">
                {/*Basic Information*/}
                <div className="flex flex-row justify-start mb-2">
                  <p className="font-medium sm:font-bold text-xs md:text-xs text-white dark:text-black bg-black dark:bg-white px-2 rounded-md mr-2">
                    {currentTrack?.info?.genre[0].maingenre}
                  </p>
                  <div className="flex flex-row">
                    <FontAwesomeIcon
                      icon={faMusic}
                      size="xs"
                      className="text-black dark:text-white p-0.5"
                    />
                    <p className="text-xs md:text-xs  text-black dark:text-white px-1 rounded-md">
                      {currentTrack?.info?.key.note}{" "}
                      {currentTrack?.info?.key.scale
                        .substring(0, 3)
                        .toLowerCase()}
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
                {/*Genre Information*/}
                <div className="w-full flex flex-row justify-start">
                  {currentTrack?.info?.relatedartist[0] && (
                    <p className="flex justify-center items-center w-auto whitespace-nowrap overflow-hidden font-medium text-2xs sm:text-xs md:text-xs bg-white dark:bg-black text-black dark:text-white py-1 px-2 rounded-full mr-1">
                      {currentTrack.info.relatedartist[0]}
                    </p>
                  )}
                  {currentTrack?.info?.relatedartist[1] && (
                    <p className="flex justify-center items-center w-auto whitespace-nowrap overflow-hidden font-medium text-2xs sm:text-xs md:text-xs bg-white dark:bg-black text-black dark:text-white py-1 px-2 rounded-full mr-1">
                      {currentTrack.info.relatedartist[1]}
                    </p>
                  )}
                  {currentTrack?.info?.relatedartist[2] && (
                    <p className="hidden sm:block justify-center items-center w-auto whitespace-nowrap overflow-hidden font-medium text-2xs sm:text-xs md:text-xs bg-white dark:bg-black text-black dark:text-white py-1 px-2 rounded-full mr-1">
                      {currentTrack.info.relatedartist[2]}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-full md:max-w-screen-xl flex justify-center h-4 sm:h-8 lg:h-8 px-0 md:pr-4 lg:px-0.5 lg:mt-4 md:h-12 mt-0 mx-auto">
              <div className="w-full" ref={equalizerContainerRef}>
                <Equalizer
                  audioRef={audioRef}
                  currentTrack={currentTrack}
                  width={equalizerWidth}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center md:order-2 order-1">
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-auto bg-neutral-200/80 dark:bg-black/80 p-1 sm:p-2 rounded-md relative">
              <div className="relative w-full h-full">
                <Image
                  src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
                    currentTrack?.metadata?.catalog ?? "default"
                  }.jpg`}
                  alt={currentTrack?.metadata?.title ?? ""}
                  className="w-36 sm:w-40 md:w-56 lg:w-72 lg:h-72 h-auto object-cover rounded-md shadow-md cursor-pointer hover:opacity-90 dark:hover:opacity-75"
                  width={150}
                  height={150}
                  priority
                />
                <Watermark size="lg" />
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
        </div>
      </div>
    </div>
  );
};

export default Hero;
