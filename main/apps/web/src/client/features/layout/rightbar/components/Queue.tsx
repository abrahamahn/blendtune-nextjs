// main/apps/web/src/client/features/layout/rightbar/components/Queue.tsx
'use client';

import React from 'react';

import { Artwork, artworkSrc, present } from '@client/components';
import { usePlayer } from '@client/features/player/services/playerService';

/** Up-next queue: the current track list, current one highlighted, click to play. */
const Queue: React.FC = () => {
  const { trackList, currentTrack, playTrack } = usePlayer();

  if (!trackList || trackList.length === 0) return null;

  return (
    <section className="bt-queue" aria-label="Up next">
      <h3 className="bt-queue-heading">Up next</h3>
      <ul className="bt-queue-list">
        {trackList.map((track) => {
          const active = track.id === currentTrack?.id;
          const title = present(track.metadata.title) ?? track.metadata.catalog;
          return (
            <li key={track.id}>
              <button
                type="button"
                className={`bt-queue-row${active ? ' bt-queue-row-active' : ''}`}
                onClick={() => playTrack(track)}
                aria-current={active ? 'true' : undefined}
              >
                <span className="bt-queue-art">
                  <Artwork src={artworkSrc(track)} alt={`${title} artwork`} />
                </span>
                <span className="bt-queue-text">
                  <span className="bt-queue-title">{title}</span>
                  <span className="bt-queue-producer">{present(track.metadata.producer) ?? '—'}</span>
                </span>
                <span className="bt-queue-dur">{present(track.info.duration) ?? ''}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Queue;
