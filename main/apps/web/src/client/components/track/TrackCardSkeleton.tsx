// main/apps/web/src/client/components/track/TrackCardSkeleton.tsx
// Loading placeholder mirroring TrackCard geometry.
import { Skeleton } from '@ui';

import './TrackCard.css';

export function TrackCardSkeleton() {
  return (
    <div className="bt-track-card" aria-hidden="true">
      <Skeleton width="100%" height="auto" style={{ aspectRatio: '1' }} />
      <Skeleton width="80%" height="0.875rem" />
      <Skeleton width="50%" height="0.75rem" />
      <Skeleton width="7.5rem" height="1.375rem" />
    </div>
  );
}
