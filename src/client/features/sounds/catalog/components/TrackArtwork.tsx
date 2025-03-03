// src/client/features/sounds/catalog/components/TrackArtwork.tsx
import React from "react";
import { Artwork, Watermark } from "@components/common";
import { PlayerIcons } from "@/client/shared/components/icons";

interface TrackArtworkProps {
  catalog: string;
  title: string;
  width: number;
  height: number;
  isPlaying: boolean;
}

const TrackArtwork: React.FC<TrackArtworkProps> = ({
  catalog,
  title,
  width,
  height,
  isPlaying,
}) => (
  <div 
    className="relative flex justify-center items-center dark:bg-black/70 bg-transparent rounded-md backdrop-blur-sm"
    style={{ width: `${width}px`, height: `${height}px` }}
  >
    <div 
      className="p-0 shadow-lg dark:shadow-none rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Artwork
        catalog={catalog}
        fallback="default"
        alt={title}
        className="rounded-md object-center object-cover"
        width={width}
        height={height}
        priority
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <PlayerIcons.PlayPause isPlaying={isPlaying} size="lg" className="text-white dark:text-white" />
      </div>
      <div className="absolute bottom-0 right-0">
        <Watermark size="sm" />
      </div>
    </div>
  </div>
);

export default TrackArtwork;
