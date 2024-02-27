import React, { useState, useEffect, useRef, RefObject } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faMusic } from "@fortawesome/free-solid-svg-icons";
import { Track } from "@/types/track";

import Image from "next/image";

import Equalizer from "@/components/shared/visualizer/Equalizer";
import { colorExtractor } from "@/utils/ColorExtractor";

import Watermark from "@/components/shared/common/Watermark";

interface TrackInfoProps {
  closeTrackInfo: () => void;
  currentTrack: Track;
  audioRef: RefObject<HTMLAudioElement>;
}

const TrackInfo: React.FC<TrackInfoProps> = ({
  closeTrackInfo,
  currentTrack,
  audioRef,
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

  const [dominantColor, setDominantColor] = useState("#000000");
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  const formatTime = (timeInSeconds: number | undefined) => {
    if (typeof timeInSeconds !== "number" || isNaN(timeInSeconds)) {
      return "0:00";
    }

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    if (!currentTrack) {
      return;
    }

    const imageUrl = `https://blendtune-public.nyc3.digitaloceanspaces.com/artwork/${
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

  useEffect(() => {
    const handleTimeUpdate = () => {
      const currentAudioRef = audioRef.current;
      setCurrentTime(currentAudioRef?.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      const currentAudioRef = audioRef.current;
      setTrackDuration(currentAudioRef?.duration || 0);
    };

    const currentAudioRef = audioRef.current;

    currentAudioRef?.addEventListener("timeupdate", handleTimeUpdate);
    currentAudioRef?.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      currentAudioRef?.removeEventListener("timeupdate", handleTimeUpdate);
      currentAudioRef?.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    };
  }, [audioRef]);

  return (
    <div className="fixed right-0  top-0 h-full w-96 bg-white/50 dark:bg-black shadow-lg z-10 pt-12 mt-4 rounded-full">
      <div
        className="p-0 rounded-2xl h-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${dominantColor}, #000000)`,
        }}
      >
        <div className="flex flex-row justify-between w-full h-12 bg-neutral-50 dark:bg-black/50 rounded-t-2xl p-3">
          <div className="flex justify-center items-center text-base text-neutral-600 dark:text-white">
            <p className="text-neutral-800 dark:text-neutral-200 text-base font-semibold">
              {currentTrack?.metadata.title.toUpperCase()} [
              {currentTrack?.info?.mood[1]},{" "}
              {currentTrack?.info?.relatedartist[0]}]
            </p>
          </div>
          <button
            className="flex justify-center items-center w-4 h-4 p-4 cursor-pointer"
            onClick={closeTrackInfo}
          >
            <FontAwesomeIcon
              className="flex justify-center items-center mt-[-8px] text-neutral-400 dark:text-neutral-200"
              size="sm"
              icon={faX}
            />
          </button>
        </div>
        <div className="flex flex-col p-8 pt-4 rounded-md m-0 mt-0 lg:mt-2">
          <div className="flex justify-center mt-0 p-0">
            <div className="w-56 h-56  bg-neutral-200/80 dark:bg-black/80 p-2 rounded-md relative">
              <Image
                src={`https://blendtune-public.nyc3.digitaloceanspaces.com/artwork/${
                  currentTrack?.metadata?.catalog ?? "default"
                }.jpg`}
                alt={currentTrack?.metadata?.title ?? ""}
                className="w-56 h-auto object-cover rounded-lg shadow-md cursor-pointer hover:opacity-75"
                width={200}
                height={200}
                priority
              />
              <Watermark size="xl" />
            </div>
          </div>
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
                <p className="text-xs md:text-xs  text-black dark:text-white px-1 rounded-md">
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
          <div className="w-full h-8 mt-3 block rounded-md">
            <div className="w-full h-8" ref={equalizerContainerRef}>
              <Equalizer
                audioRef={audioRef}
                currentTrack={currentTrack}
                width={equalizerWidth}
              />
            </div>
          </div>
          {/* Navigation Bar */}
          <div className="flex w-full h-full items-center justify-center mt-3">
            <button
              className="w-full border-md bg-black/10 dark:bg-white/10 h-1 rounded-full shadow-xl overflow-hidden cursor-pointer"
              onClick={(e) => {
                // Calculate the click position relative to the duration bar's width
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
              }}
            >
              <div
                className="bg-black/40 dark:bg-white h-1 rounded-md shadow-md w-full transition-width duration-100 ease-in-out cursor-pointer"
                style={{
                  width: `${(currentTime / (audioRef?.current?.duration ?? 1)) * 100}%`,
                }}
              />
            </button>
          </div>
          {/* Timestamp */}
          <div className="text-xs mt-1 w-full h-full flex items-center justify-between user-select-none">
            {" "}
            {/* Apply user-select-none here */}
            <p className="text-black/60 dark:text-white">
              {formatTime(currentTime)}
            </p>
            <p className="text-neutral-500">{formatTime(trackDuration)}</p>{" "}
          </div>
          <div className="w-full mt-4 border-b pb-1">
            <p className="text-neutral-500 dark:text-white">Track Details</p>
          </div>
          <div className="w-full justify-between mt-2 flex flex-row text-neutral-500  dark:text-white">
            <p className="text-xs">Genre</p>
            <p className="text-xs">{currentTrack?.info?.genre[0].maingenre}</p>
          </div>
          <div className="w-full justify-between mt-2 flex flex-row text-neutral-500  dark:text-white">
            <p className="text-xs">BPM</p>
            <p className="text-xs">{currentTrack?.info?.bpm}</p>
          </div>
          <div className="w-full justify-between mt-2 flex flex-row text-neutral-500  dark:text-white">
            <p className="text-xs">Key</p>
            <p className="text-xs">
              {currentTrack?.info?.key.note} {currentTrack?.info?.key.scale}
            </p>
          </div>
          <div className="w-full justify-between mt-2 flex flex-row text-neutral-500  dark:text-white">
            <p className="text-xs">Mood</p>
            <p className="text-xs">
              {currentTrack?.info?.mood[0]}, {currentTrack?.info?.mood[1]},{" "}
              {currentTrack?.info?.mood[2]}
            </p>
          </div>
          <div className="w-full justify-between mt-2 flex flex-row text-neutral-500  dark:text-white">
            <p className="text-xs">Related Artist</p>
            <p className="text-xs">
              {currentTrack?.info?.relatedartist[0]},{" "}
              {currentTrack?.info?.relatedartist[1]},{" "}
              {currentTrack?.info?.relatedartist[2]}
            </p>
          </div>
        </div>
        <div className="px-4">
          <div className="flex flex-col p-2 rounded-md mt-2 h-20">
            <p className="text-neutral-500 dark:text-white">Sounds Similar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackInfo;
