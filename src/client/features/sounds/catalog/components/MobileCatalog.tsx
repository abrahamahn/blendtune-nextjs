// src/client/features/sounds/tracks/components/MobileCatalog.tsx

"use client";
import React from "react";
import { Track } from "@/shared/types/track";
import { RootState } from "@core/store";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

import { Artwork, Watermark } from "@components/common";

export interface MobileCatalogProps {
  tracks: Track[]; // List of tracks to be displayed in the catalog.
  playTrack: (track: Track) => void; // Function to handle track playback.
  onTitleClick: (selectedTrack: Track) => void; // Function to handle track title click.
}

/**
 * MobileCatalog Component
 *
 * Displays a list of tracks optimized for mobile view.
 * Allows users to interact with tracks by playing, liking, or adding them.
 *
 * @param {MobileCatalogProps} props - Component properties.
 * @returns {JSX.Element} The rendered component.
 */
const MobileCatalog: React.FC<MobileCatalogProps> = ({
  tracks,
  playTrack,
  onTitleClick,
}) => {
  // Retrieve playback state from the Redux store.
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );

  /**
   * Renders a value only if it is valid (not empty or "n/a").
   *
   * @param {string} value - The value to validate.
   * @returns {string | null} The value if valid, otherwise null.
   */
  function renderValue(value: string) {
    return value && value !== "n/a" && value !== "" ? value : null;
  }

  if (!tracks) {
    return null; // Return null if there are no tracks to display.
  }

  return (
    <div className="block xl:hidden w-full pt-0 md:pt-4 justify-center items-center mx-auto">
      <div className="flex max-w-screen-xl pl-2 lg:px-2 mx-auto flex-col relative">
        {tracks.map((track: Track) => (
          <div
            key={track.id}
            className="flex p-1 border-neutral-300 hover:bg-neutral-100 dark:border-neutral-800 group dark:hover:bg-neutral-900 justify-center items-center rounded-lg pr-12 z-0"
            onClick={(e) => {
              e.currentTarget.blur();
              playTrack(track);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
          {/* Track Image & Play Button */}
          <div className="relative justify-center items-center flex w-16 h-16 dark:bg-black/70 bg-transparent rounded-md backdrop-blur-sm">
            <div className="w-16 h-16 dark:w-16 dark:h-16 p-0 dark:p-1.5 shadow-lg dark:shadow-none rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105">
              <Artwork
                catalog={track?.metadata?.catalog}
                fallback="default"
                alt={track.metadata.title}
                className="rounded-md object-center object-cover w-full h-full"
                width={50}
                height={50}
                priority
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {isPlaying ? (
                  <FontAwesomeIcon icon={faPause} size="lg" className="text-white" />
                ) : (
                  <FontAwesomeIcon icon={faPlay} size="lg" className="text-white" />
                )}
              </div>
              <div className="absolute bottom-0 right-0">
                <Watermark size="sm" />
              </div>
            </div>
          </div>


            {/* Track Information */}
            <div className="flex flex-row justify-between w-full ml-2">
              <div className="flex-start flex-col cursor-pointer dark:border-neutral-800 pt-0">
                {/* Track Title */}
                <div className="md:ml-1 text-left text-xs md:text-sm text-[#070707] dark:text-neutral-300 font-semibold">
                  <button
                    className="uppercase"
                    key={track.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onTitleClick(track);
                    }}
                  >
                    {renderValue(track.metadata.title)}
                  </button>
                </div>

                {/* Track Producer */}
                <div className="cursor-pointer md:flex flex-row text-[#707070] hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white text-left text-2xs md:text-xs w-auto md:w-auto md:ml-1">
                  {renderValue(track.metadata.producer) && <p>{renderValue(track.metadata.producer)}</p>}
                </div>
              </div>

              {/* Track Attributes */}
              <div className="flex flex-col justify-center items-center">
                <div className="ml-auto justify-end text-black dark:text-white text-2xs md:text-xs mr-0">
                  {/* Genre */}
                  {renderValue(track.info.genre[0].maingenre) && (
                    <p className="inline-block text-[#070707] dark:text-neutral-200 bg-blue-200 dark:bg-blue-900 mr-1 px-2 py-0.5 rounded-md overflow-hidden">
                      {renderValue(track.info.genre[0].maingenre)}
                    </p>
                  )}

                  {/* Key and Scale */}
                  {renderValue(track.info.key.note) &&
                    renderValue(track.info.key.scale.substring(0, 3).toLowerCase()) && (
                      <p className="inline-block text-[#070707] dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 mr-1 px-2 py-0.5 rounded-md overflow-hidden">
                        {renderValue(track.info.key.note)}
                        {renderValue(track.info.key.scale.substring(0, 3).toLowerCase())}
                      </p>
                    )}

                  {/* BPM */}
                  {renderValue(track.info.bpm) && (
                    <p className="inline-block text-[#070707] dark:text-neutral-200 bg-neutral-200 dark:bg-gray-900 px-2 py-0.5 rounded-md overflow-hidden">
                      {renderValue(track.info.bpm)}
                    </p>
                  )}
                </div>

                {/* Track Mood */}
                <div className="flex flex-row ml-auto text-center text-2xs md:text-xs w-auto">
                  {track.info.mood.slice(0, 4).map((mood, index) => (
                    renderValue(mood) && (
                      <p
                        key={index}
                        className="px-1 cursor-pointer text-[#707070] hover:text-neutral-400 dark:text-neutral-300 dark:hover:text-white"
                      >
                        {renderValue(mood)}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Track Actions */}
            <div className="absolute flex right-0 lg:right-6 items-center group-hover:shadow-3xl group-hover:shadow-neutral-100 dark:group-hover:shadow-neutral-900">
              {/* Like Button */}
              <div className="text-[#6D6D6D] group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900">
                <FontAwesomeIcon icon={faHeart} className="invisible group-hover:visible" />
              </div>

              {/* Add Button */}
              <div className="text-[#6D6D6D] group-hover:bg-neutral-100 dark:text-neutral-300 p-2.5 sm:p-3 dark:group-hover:bg-neutral-900">
                <FontAwesomeIcon icon={faPlus} className="invisible group-hover:visible" />
              </div>

              {/* More Options */}
              <div className="dark:text-white sm:p-3 text-[#6D6D6D] flex justify-center p-2.5 mr-1">
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
