// src\client\features\sounds\tracks\components\DesktopCatalog.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import Image from "next/image";
import { Track } from "@/shared/types/track";
import { RootState } from '@core/store';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

import Watermark from "@components/common//Watermark";
import EqualizerIcon from "@components/common//EqualizerIcon";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export interface DesktopCatalogProps {
  tracks: Track[];
  playTrack: (selectedTrack: Track) => void;
  onTitleClick: (selectedTrack: Track) => void;
}

const DesktopCatalog: React.FC<DesktopCatalogProps> = ({
  tracks,
  playTrack,
  onTitleClick,
}) => {
  const currentTrack = useSelector(
    (state: RootState) =>
      state.audio.playback.currentTrack as Track | undefined
  );
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );

  // Local state for the right bar window. Replace this with your actual implementation if needed.
  const [rightBarOpen, setRightBarOpen] = useState(false);

  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setWaveformWidth(width);
      }
    });

    if (waveformContainerRef.current) {
      resizeObserver.observe(waveformContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function renderValue(value: string) {
    return value && value !== "n/a" && value !== "" ? value : null;
  }

  function formatDuration(durationString: string): string {
    const [minutesStr, secondsStr] = durationString.split(":");
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);

    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  }

  if (!tracks) {
    return null;
  }

  // New function to handle title clicks with the exception for the currently playing track.
  const handleTitleClick = (selectedTrack: Track) => {
    // If clicking on the currently playing track:
    if (currentTrack?.id === selectedTrack.id) {
      // If the right bar is not open, open it and load the track info
      if (!rightBarOpen) {
        setRightBarOpen(true);
        onTitleClick(selectedTrack);
      }
      // If it's already open, do nothing.
      return;
    }
    // For any other track, switch playback immediately.
    playTrack(selectedTrack);
  };

  return (
    <div className="hidden xl:block w-full justify-center items-center mx-auto">
      <div className="flex max-w-screen-xl pl-2 lg:px-4 mx-auto flex-col relative">
        {tracks.map((track: Track, index: number) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          return (
            <div key={track.id} className="relative">
              {/* This div adds a flat bottom border spanning the full width */}
              <div className="absolute bottom-0 left-0 right-0 border-b border-neutral-300 dark:border-neutral-900" />
                {/* Inner container with rounded corners and only top/side borders */}
                <div
                  className="cursor-pointer flex items-center p-1 border-neutral-300 hover:bg-[#F9F9F9] dark:hover:bg-neutral-900 group rounded-lg relative h-18"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    playTrack(track);
                  }}
                >
                {/* Numbering / Equalizer / Play-Pause Icon */}
                <div className="relative text-neutral-500 mr-4 w-8 h-8 flex justify-center items-center">
                  
                  {/* Equalizer Icon (Always rendered, perfectly centered) */}
                  {isCurrentTrack && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        isPlaying ? "opacity-100" : "opacity-70"
                      } group-hover:opacity-0`}
                    >
                      <EqualizerIcon isPlaying={isPlaying} />
                    </div>
                  )}

                  {/* Track Number (Only shows when not current track) */}
                  {!isCurrentTrack && (
                    <p className="text-xs transition-opacity duration-300 group-hover:opacity-0">
                      {index + 1}
                    </p>
                  )}

                  {/* Play/Pause Icon (Takes priority on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer">
                    {isCurrentTrack && isPlaying ? (
                      <FontAwesomeIcon
                        icon={faPause}
                        size="lg"
                        className="text-[#1F1F1F] dark:text-white"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faPlay}
                        size="lg"
                        className="text-[#1F1F1F] dark:text-white"
                      />
                    )}
                  </div>
                </div>
                {/* Artwork */}
                <div className="relative w-16 h-16 dark:bg-black/70 bg-neutral-200/70 rounded-md">
                  <button
                    key={track.id}
                    className="w-16 h-16 md:p-1.5 duration-300 ease-in-out rounded-md group-hover:scale-105 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTitleClick(track);
                    }}
                  >
                    <Image
                      crossOrigin="anonymous"
                      src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
                        track?.metadata?.catalog ?? "default"
                      }.jpg`}
                      alt={track.metadata.title}
                      className="transition-transform rounded-md object-center object-cover w-full h-full"
                      width={100}
                      height={100}
                      priority
                    />
                  </button>
                  <div className="absolute bottom-0 right-0">
                    <Watermark size="sm" />
                  </div>
                </div>
                {/* Title and Producer */}
                <div className="flex flex-row justify-between w-full ml-2">
                  <div className="flex flex-row w-5/12">
                    <div
                      ref={waveformContainerRef}
                      className="w-0 cursor-pointer"
                    ></div>
                    <div className="flex-start flex-col justify-center items-center cursor-pointer dark:border-neutral-800 ml-1">
                      <div className="mt-2 text-left text-2xs md:text-sm text-neutral-800 dark:text-neutral-300 font-semibold w-60">
                        <button
                          key={track.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTitleClick(track);
                          }}
                          className="hover:underline"
                        >
                          <p className="text-[#1F1F1F] dark:text-neutral-200 text-sm font-semibold cursor-pointer hover:underline user-select-none mb-1">
                            {track?.metadata?.title.toUpperCase()} [
                            {track?.info?.relatedartist[0]}]
                          </p>
                        </button>
                        <div className="cursor-pointer md:flex flex-row text-[#707070] dark:text-neutral-600 dark:hover:text-white text-2xs md:text-2xs w-auto md:w-auto">
                          {renderValue(track.metadata.producer) && (
                            <p className="hover:underline uppercase">
                              {renderValue(track.metadata.producer)?.toUpperCase() ?? ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 items-center justify-center gap-8 w-64 mr-2">
                    <div className="col-span-1">
                      <div className="mr-8 justify-center items-center">
                        <p className="text-[#707070] dark:text-[#707070] text-2xs">
                          {renderValue(formatDuration(track.info.duration))}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="justify-center items-center">
                        <p className="text-[#707070] dark:text-[#707070] text-2xs">
                          {renderValue(track.info.bpm)}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="flex justify-center items-center">
                        <p className="text-center text-white bg-blue-300 dark:bg-neutral-950 text-2xs px-2 py-0.5 rounded-md w-auto">
                          {renderValue(track.info.key.note)}
                          {renderValue(
                            track.info.key.scale.substring(0, 3).toLowerCase()
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex-col col-span-2">
                      {renderValue(track?.info?.genre[0]?.maingenre) && (
                        <div className="flex justify-center items-center">
                          <p className="text-center text-white bg-blue-300 dark:bg-blue-900 text-2xs px-2 py-0.5 mb-1 rounded-md w-auto">
                            {renderValue(track.info.genre[0].maingenre)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-2 grid grid-cols-3 grid-rows-2 gap-2 w-64 bg-[#F9F9F9] dark:bg-neutral-900/50 rounded-md justify-center items-center">
                    <div className="col-span-1 row-span-1">
                      <div className="flex flex-row justify-center items-center text-center text-2xs md:text-2xs w-full">
                        {renderValue(track.info.relatedartist[0]) && (
                          <p className="px-1 mr-1 cursor-pointer text-[#707070] hover:text-[#707070] dark:text-[#707070] dark:hover:text-white overflow-hidden whitespace-nowrap marquee">
                            {renderValue(track.info.relatedartist[0])}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 row-span-1">
                      <div className="flex flex-row justify-center items-center text-center text-2xs md:text-2xs w-full">
                        {renderValue(track.info.relatedartist[1]) && (
                          <p className="px-1 cursor-pointer text-[#707070] hover:text-[#707070] dark:text-[#707070] dark:hover:text-white overflow-hidden whitespace-nowrap marquee">
                            {renderValue(track.info.relatedartist[1])}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 row-span-1">
                      <div className="flex flex-row justify-center items-center text-center text-2xs md:text-2xs w-full">
                        {renderValue(track.info.mood[0]) && (
                          <p className="px-1 mr-1 cursor-pointer text-[#707070] hover:text-[#707070] dark:text-[#707070] dark:hover:text-white overflow-hidden whitespace-nowrap marquee">
                            {renderValue(track.info.mood[0])}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 row-span-1">
                      <div className="flex flex-row justify-center items-center text-center text-2xs md:text-2xs w-full">
                        {renderValue(track.info.mood[1]) && (
                          <p className="px-1 cursor-pointer text-[#707070] hover:text-[#707070] dark:text-[#707070] dark:hover:text-white overflow-hidden whitespace-nowrap marquee">
                            {renderValue(track.info.mood[1])}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 row-span-1">
                      <div className="flex flex-row justify-center items-center text-center text-2xs md:text-2xs w-full">
                        {renderValue(track.info.mood[2]) && (
                          <p className="px-1 cursor-pointer text-[#707070] hover:text-[#707070] dark:text-[#707070] dark:hover:text-white overflow-hidden whitespace-nowrap marquee">
                            {renderValue(track.info.mood[2])}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center flex-grow relative">
                    <div className="flex justify-center items-center text-[#707070] dark:text-neutral-300 w-8 h-8 mr-2 bg-[#F9F9F9] hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 hover:cursor-pointer">
                      <FontAwesomeIcon icon={faHeart} />
                    </div>
                    <div className="flex justify-center items-center text-[#707070] dark:text-neutral-300 w-8 h-8 mr-2 bg-[#F9F9F9] hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 hover:cursor-pointer">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <div className="flex justify-center items-center text-[#707070] dark:text-neutral-300 w-8 h-8 bg-[#F9F9F9] hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 hover:cursor-pointer">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopCatalog;
