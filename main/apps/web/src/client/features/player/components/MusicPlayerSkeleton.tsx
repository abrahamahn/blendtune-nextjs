// main/apps/web/src/client/features/player/components/MusicPlayerSkeleton.tsx
// Loading placeholder mirroring the player bar geometry.
import React from 'react';

import { Skeleton } from '@ui';

import './player.css';

const MusicPlayerSkeleton: React.FC = () => (
  <div className="bt-player-skeleton" aria-hidden="true">
    <Skeleton width="2.25rem" height="2.25rem" />
    <Skeleton width="2.25rem" height="2.25rem" />
    <Skeleton width="100%" height="1.5rem" />
    <Skeleton width="3rem" height="3rem" />
    <Skeleton width="9rem" height="1.375rem" />
  </div>
);

export default MusicPlayerSkeleton;
