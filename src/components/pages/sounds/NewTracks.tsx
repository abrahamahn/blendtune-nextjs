import React from "react";
import TrackCard from "@/components/shared/common/TrackCard";
import { Track } from "@/types/track";

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
    <div className="w-full">
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
