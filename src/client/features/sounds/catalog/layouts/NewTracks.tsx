// src\client\features\sounds\catalog\components\NewTracks.tsx

import React from "react";
import TrackCard from "@/client/features/sounds/catalog/components/TrackCard";
import { useTracks } from "@/client/features/tracks";
import useTrackPlayback from "@/client/features/sounds/catalog/hooks/useTrackPlayback";

/**
 * NewTracks Component
 * 
 * Displays a list of newly added tracks in a horizontal layout.
 * Uses context hooks directly for data access.
 */
const NewTracks: React.FC = () => {
  // Get tracks directly from context
  const { tracks, isLoading } = useTracks();
  
  // Get playback functionality from our hook
  const { handleTrackPlay } = useTrackPlayback();

  return (
    <div className="w-full">
      <TrackCard 
        tracks={tracks}
        playTrack={handleTrackPlay}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NewTracks;