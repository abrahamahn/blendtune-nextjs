// src\client\features\sounds\catalog\CatalogProvider.tsx

"use client";

import React, { useState } from "react";
import { Track } from "@/shared/types/track";
import { usePlayer } from "@player/services/playerService";
import { DesktopCatalog, MobileCatalog } from "./layouts";

interface CatalogProviderProps {
  tracks: Track[]; // Tracks to be displayed in the catalog
  onTrackSelect?: (track: Track) => void; // Optional callback for when a track is selected
}

/**
 * CatalogProvider component
 * 
 * Provides a responsive catalog view that automatically switches between
 * mobile and desktop layouts based on screen size. Handles track playback
 * and right panel display.
 */
const CatalogProvider: React.FC<CatalogProviderProps> = ({
  tracks,
  onTrackSelect,
}) => {
  const { playTrack: playTrackInPlayer } = usePlayer();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Handler for playing a track
  const handlePlayTrack = (track: Track) => {
    playTrackInPlayer(track);
    
    // Callback if provided
    if (onTrackSelect) {
      onTrackSelect(track);
    }
  };

  // Handler for title clicks, which opens the right info panel
  const handleTitleClick = (track: Track) => {
    setSelectedTrack(track);
    setShowRightPanel(true);
    
    // Callback if provided
    if (onTrackSelect) {
      onTrackSelect(track);
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Catalog (hidden on mobile) */}
      <DesktopCatalog
        tracks={tracks}
        playTrack={handlePlayTrack}
        onTitleClick={handleTitleClick}
      />
      
      {/* Mobile Catalog (hidden on desktop) */}
      <MobileCatalog
        tracks={tracks}
        playTrack={handlePlayTrack}
        onTitleClick={handleTitleClick}
      />
    </div>
  );
};

export default CatalogProvider;