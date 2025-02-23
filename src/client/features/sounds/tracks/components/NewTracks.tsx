// src\client\features\sounds\tracks\components\NewTracks.tsx
import React from "react";
import TrackCard from "@tracks/components/TrackCard";
import { Track } from "@/shared/types/track";

interface NewTracksProps {
  tracks: Track[];
  currentTrack?: Track;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
}

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
