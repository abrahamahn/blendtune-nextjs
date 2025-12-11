// src\client\features\layout\rightbar\components\SimpleTrackProgress.tsx
/**
 * @fileoverview Track metadata display component
 * @module layout/rightbar/components/TrackMetadata
 */

import React from "react";
import { Track } from "@/shared/types/track";

interface TrackMetadataProps {
  currentTrack?: Track;
}

/**
 * Displays detailed track metadata in a list format
 */
export const TrackMetadata: React.FC<TrackMetadataProps> = ({ currentTrack }) => {
  // Define metadata fields to display
  const metadataFields = [
    { label: "Genre", value: currentTrack?.info?.genre[0].maingenre },
    { label: "BPM", value: currentTrack?.info?.bpm },
    { label: "Key", value: `${currentTrack?.info?.key.note} ${currentTrack?.info?.key.scale}` },
    { 
      label: "Mood", 
      value: currentTrack?.info?.mood ? 
        `${currentTrack.info.mood[0]}, ${currentTrack.info.mood[1]}, ${currentTrack.info.mood[2]}` : 
        undefined 
    },
    { 
      label: "Related Artist", 
      value: currentTrack?.info?.relatedartist ? 
        `${currentTrack.info.relatedartist[0]}, ${currentTrack.info.relatedartist[1]}, ${currentTrack.info.relatedartist[2]}` : 
        undefined 
    }
  ];

  return (
    <>
      {metadataFields.map((field, index) => (
        <div key={index} className="w-full justify-between mt-2 flex flex-row text-neutral-500 dark:text-white">
          <p className="text-xs">{field.label}</p>
          <p className="text-xs">{field.value}</p>
        </div>
      ))}
    </>
  );
};