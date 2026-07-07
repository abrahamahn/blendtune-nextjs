// main/apps/web/src/client/features/sounds/catalog/layouts/Catalog.tsx
// The one catalog list: TrackRow per track (responsive CSS inside the composite
// handles narrow viewports), skeletons while loading, inviting empty state.
import React from 'react';

import { EmptyState, TrackRow, TrackRowSkeleton } from '@client/components';
import { usePlayer } from '@features/player/services/playerService';

import type { Track } from '@/shared/types/track';

interface CatalogProps {
  tracks: Track[];
  isLoading?: boolean;
}

const SKELETON_ROWS = 10;

const Catalog: React.FC<CatalogProps> = ({ tracks, isLoading = false }) => {
  const { currentTrack, isPlaying, playTrack } = usePlayer();

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <TrackRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return <EmptyState title="No beats match" hint="Loosen a filter." />;
  }

  return (
    <div>
      {tracks.map((track) => (
        <TrackRow
          key={track.id}
          track={track}
          playing={isPlaying && currentTrack?.id === track.id}
          onPlay={() => playTrack(track)}
        />
      ))}
    </div>
  );
};

export default Catalog;
