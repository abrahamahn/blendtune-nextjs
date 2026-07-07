// main/apps/web/src/client/components/track/Artwork.tsx
// Square track artwork with an intentional fallback: while the media bucket is
// empty the amber-on-console music monogram is the common face of the catalog.
import { useState } from 'react';

import '../components.css';

export interface ArtworkProps {
  /** Image URL; omit to render the monogram fallback */
  src?: string;
  /** Descriptive alt text (fallback exposes it via aria-label) */
  alt: string;
  className?: string;
}

function MusicGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M9 18.5a2.5 2.5 0 1 1-1.5-2.29V5.5a1 1 0 0 1 .76-.97l8-2A1 1 0 0 1 17.5 3.5v11.29a2.5 2.5 0 1 1-1.5-.29V7.28l-7 1.75Z" />
    </svg>
  );
}

export function Artwork({ src, alt, className }: ArtworkProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src != null && src !== '' && !failed;
  return (
    <span
      className={`bt-artwork ${className ?? ''}`.trim()}
      {...(showImage ? {} : { role: 'img', 'aria-label': alt })}
    >
      {showImage ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <MusicGlyph />
      )}
    </span>
  );
}
