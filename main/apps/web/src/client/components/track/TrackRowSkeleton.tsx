// main/apps/web/src/client/components/track/TrackRowSkeleton.tsx
// Loading placeholder mirroring TrackRow geometry.
import { Skeleton } from '@ui';

import './TrackRow.css';

export function TrackRowSkeleton() {
  return (
    <div className="bt-track-row" aria-hidden="true">
      <span className="bt-track-row-art">
        <Skeleton width="3rem" height="3rem" />
      </span>
      <span className="bt-track-row-id">
        <Skeleton width="9rem" height="0.875rem" />
        <Skeleton width="5rem" height="0.75rem" style={{ marginTop: 'var(--ui-gap-xs)' }} />
      </span>
      <Skeleton width="7.5rem" height="1.375rem" />
    </div>
  );
}
