// src/client/features/sounds/tracks/components/NewTracks.tsx

import React from "react";
import TrackCard from "@tracks/components/TrackCard";
import { Track } from "@/shared/types/track";

interface NewTracksProps {
  tracks: Track[];            // List of tracks to display.
  currentTrack?: Track;       // Currently playing track (if any).
  isPlaying: boolean;         // Indicates whether a track is currently playing.
  playTrack: (track: Track) => void; // Function to trigger track playback.
}

/**
 * NewTracks Component
 * 
 * Displays a list of tracks in a scrollable horizontal layout.
 * Delegates rendering and playback control to the `TrackCard` component.
 *
 * @param {NewTracksProps} props - Component properties.
 * @returns {JSX.Element} The rendered component.
 */
const NewTracks: React.FC<NewTracksProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  playTrack,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <TrackCard
        tracks={tracks}
        currentTrack={currentTrack}
        playTrack={playTrack}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default NewTracks;
