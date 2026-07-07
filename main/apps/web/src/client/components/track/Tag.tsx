// main/apps/web/src/client/components/track/Tag.tsx
// Quiet tag for moods / type-artist references. Muted text only — the facts
// readout is the sole element that speaks with emphasis on a track.
import type { ReactNode } from 'react';

import '../components.css';

export interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return <span className={`bt-tag ${className ?? ''}`.trim()}>{children}</span>;
}
