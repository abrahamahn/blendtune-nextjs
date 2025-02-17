"use client";
import React from "react";
import Image from "next/image";
import { Track } from "@/shared/types/track";
import { RootState } from "@/client/environment/redux/store";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

import Watermark from "@/client/ui/components/common/Watermark";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export interface MobileCatalogProps {
  tracks: Track[];
  playTrack: (track: Track) => void;
  onTitleClick: (selectedTrack: Track) => void;
}

const MobileCatalog: React.FC<MobileCatalogProps> = ({
  tracks,
  playTrack,
  onTitleClick,
}) => {
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );
  function renderValue(value: string) {
    return value && value !== "n/a" && value !== "" ? value : null;
  }

  if (!tracks) {
    return null;
  }

  return (
    <div className="block xl:hidden w-full pt-0 md:pt-4 justify-center items-center mx-auto">
      <div className="flex max-w-screen-xl pl-2 lg:px-2 mx-auto flex-col relative">
        {tracks.map((track: Track) => (
          <div
            key={track.id}
            className="flex p-1 border-neutral-300 hover:bg-neutral-100 dark:border-neutral-800 group dark:hover:bg-neutral-900 justify-center items-center rounded-lg pr-12 z-0"
            onClick={() => playTrack(track)}
          >
            <div className="relative justify-center items-center flex w-16 h-16 dark:bg-black/70 bg-neutral-200/70 rounded-md">
              <div className="w-16 h-16 p-1.5 rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105">
                <Image
                  crossOrigin="anonymous"
                  src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
                    track?.metadata?.catalog ?? "default"
                  }.jpg`}
                  alt={track.metadata.title}
                  className="rounded-md object-center object-cover w-full h-full"
                  width={50}
                  height={50}
                  loading="lazy"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
                </div>
                <div className="absolute bottom-0 right-0">
                  <Watermark size="sm" />
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between w-full ml-2">
              <div className="flex-start flex-col cursor-pointer dark:border-neutral-800 pt-1">
                <div className="md:ml-1 text-left text-xs md:text-sm text-neutral-800 dark:text-neutral-300 font-semibold">
                  <button key={track.id} onClick={() => onTitleClick(track)}>
                    {renderValue(track.metadata.title)}
                  </button>
                </div>
                <div className="cursor-pointer md:flex flex-row text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white text-left text-2xs md:text-xs w-auto md:w-auto md:ml-1">
                  {renderValue(track.metadata.producer) && (
                    <p>{renderValue(track.metadata.producer)}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center items-center">
                <div className="ml-auto justify-end text-black dark:text-white text-2xs md:text-xs mr-0">
                  {renderValue(track.info.genre[0].maingenre) && (
                    <p className="inline-block bg-blue-200 dark:bg-blue-900 mr-1 px-2 py-0.5 rounded-md overflow-hidden">
                      {renderValue(track.info.genre[0].maingenre)}
                    </p>
                  )}
                  {renderValue(track.info.key.note) &&
                    renderValue(
                      track.info.key.scale.substring(0, 3).toLowerCase()
                    ) && (
                      <p className="inline-block bg-neutral-200 dark:bg-neutral-800 mr-1 px-2 py-0.5 rounded-md overflow-hidden">
                        {renderValue(track.info.key.note)}
                        {renderValue(
                          track.info.key.scale.substring(0, 3).toLowerCase()
                        )}
                      </p>
                    )}
                  {renderValue(track.info.bpm) && (
                    <p className="inline-block bg-neutral-200 dark:bg-gray-900 px-2 py-0.5 rounded-md overflow-hidden">
                      {renderValue(track.info.bpm)}
                    </p>
                  )}
                </div>
                <div className="flex flex-row ml-auto text-center text-2xs md:text-xs w-auto">
                  {renderValue(track.info.mood[0]) && (
                    <p className="px-1 cursor-pointer text-neutral-600 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-white">
                      {renderValue(track.info.mood[0])}
                    </p>
                  )}
                  {renderValue(track.info.mood[1]) && (
                    <p className="px-1 cursor-pointer text-neutral-600 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-white">
                      {renderValue(track.info.mood[1])}
                    </p>
                  )}
                  {renderValue(track.info.mood[2]) && (
                    <p className="px-1 cursor-pointer text-neutral-600 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-white">
                      {renderValue(track.info.mood[2])}
                    </p>
                  )}

                  {renderValue(track.info.mood[3]) && (
                    <p className="px-1 cursor-pointer text-neutral-600 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-white">
                      {renderValue(track.info.mood[3])}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute flex right-0 lg:right-6 items-center group-hover:shadow-3xl group-hover:shadow-neutral-100 dark:group-hover:shadow-neutral-900 ">
              <div className="text-neutral-500 group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="invisible group-hover:visible "
                />
              </div>
              <div className="text-neutral-500 group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="invisible group-hover:visible"
                />
              </div>
              <div className="dark:text-white sm:p-3 text-neutral-500 flex justify-center p-2.5 mr-1">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCatalog;
