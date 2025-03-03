// src\client\features\sounds\catalog\layouts\MobileCatalog.tsx
"use client";
import React from "react";
import { Track } from "@/shared/types/track";
import { usePlayer } from "@/client/features/player/services/playerService";
import TrackArtwork from "@catalog/components/TrackArtwork";
import TrackActions from "@catalog/components/TrackActions";
import { renderValue } from "@client/shared/utils/stringHelpers";

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
  const { isPlaying } = usePlayer();

  if (!tracks) return null;

  return (
    <div className="block xl:hidden w-full pt-0 md:pt-4 justify-center items-center mx-auto">
      <div className="flex max-w-screen-xl pl-2 lg:px-2 mx-auto flex-col relative">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex p-1 border-neutral-300 hover:bg-neutral-100 dark:border-neutral-800 group dark:hover:bg-neutral-900 justify-center items-center rounded-lg pr-12 z-0"
            onClick={(e) => {
              e.currentTarget.blur();
              playTrack(track);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Artwork with overlay */}
            <TrackArtwork 
              catalog={track?.metadata?.catalog}
              title={track.metadata.title}
              width={50}
              height={50}
              isPlaying={isPlaying}
            />

            {/* Track Information */}
            <div className="flex flex-row justify-between w-full ml-2">
              <div className="flex-start flex-col cursor-pointer dark:border-neutral-800 pt-0">
                <div className="md:ml-1 text-left text-xs md:text-sm text-[#070707] dark:text-neutral-300 font-semibold">
                  <button
                    className="uppercase"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onTitleClick(track);
                    }}
                  >
                    {renderValue(track.metadata.title)}
                  </button>
                </div>
                <div className="cursor-pointer md:flex flex-row text-[#707070] hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white text-left text-2xs md:text-xs">
                  {renderValue(track.metadata.producer) && <p>{renderValue(track.metadata.producer)}</p>}
                </div>
              </div>

              {/* Track Attributes */}
              <div className="flex flex-col justify-center items-center">
                <div className="ml-auto justify-end text-black dark:text-white text-2xs md:text-xs mr-0">
                  {renderValue(track.info.genre[0].maingenre) && (
                    <p className="inline-block text-[#070707] dark:text-neutral-200 bg-blue-200 dark:bg-blue-900 mr-1 px-2 py-0.5 rounded-md overflow-hidden">
                      {renderValue(track.info.genre[0].maingenre)}
                    </p>
                  )}
                  {renderValue(track.info.key.note) &&
                    renderValue(track.info.key.scale.substring(0, 3).toLowerCase()) && (
                      <p className="inline-block text-[#070707] dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 mr-1 px-2 py-0.5 rounded-md overflow-hidden">
                        {renderValue(track.info.key.note)}
                        {renderValue(track.info.key.scale.substring(0, 3).toLowerCase())}
                      </p>
                    )}
                  {renderValue(track.info.bpm) && (
                    <p className="inline-block text-[#070707] dark:text-neutral-200 bg-neutral-200 dark:bg-gray-900 px-2 py-0.5 rounded-md overflow-hidden">
                      {renderValue(track.info.bpm)}
                    </p>
                  )}
                </div>
                <div className="flex flex-row ml-auto text-center text-2xs md:text-xs">
                  {track.info.mood.slice(0, 4).map((mood, index) =>
                    renderValue(mood) ? (
                      <p
                        key={index}
                        className="px-1 cursor-pointer text-[#707070] hover:text-neutral-400 dark:text-neutral-300 dark:hover:text-white"
                      >
                        {renderValue(mood)}
                      </p>
                    ) : null
                  )}
                </div>
              </div>
            </div>

            {/* Track Actions */}
            <TrackActions />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCatalog;
