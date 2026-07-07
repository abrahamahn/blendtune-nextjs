// main/apps/web/src/client/features/player/components/PlayerDetails.tsx
/**
 * Expanded player state — the details panel that replaced the right sidebar.
 * Slides up from the player bar with artwork, full facts, moods, and related
 * artists for the current track.
 */
import React from 'react';

import { CloseButton, Text } from '@ui';
import { Artwork, FactsReadout, Tag, artworkSrc, present, trackFacts } from '@client/components';

import './player.css';

import type { Track } from '@/shared/types/track';

interface PlayerDetailsProps {
  track: Track;
  playing: boolean;
  onClose: () => void;
}

/** Non-empty values of a possibly sparse string list. */
const presentAll = (values: string[] | undefined): string[] =>
  (values ?? []).map(present).filter((value): value is string => value != null);

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ track, playing, onClose }) => {
  const { note, scale, bpm, duration } = trackFacts(track);
  const producer = present(track.metadata.producer);
  const genre = present(track.info.genre[0]?.maingenre);
  const moods = presentAll(track.info.mood).slice(0, 3);
  const relatedArtists = presentAll(track.info.relatedartist).slice(0, 3);

  return (
    <section className="bt-player-details" aria-label="Track details">
      <CloseButton className="bt-player-details-close" onClick={onClose} aria-label="Close track details" />
      <div className="bt-player-details-inner">
        <span className="bt-player-details-art">
          <Artwork src={artworkSrc(track)} alt={track.metadata.title} />
        </span>
        <div className="bt-player-details-id">
          <Text as="span" className="bt-display bt-player-details-title">
            {track.metadata.title}
            {relatedArtists[0] != null && ` [${relatedArtists[0]}]`}
          </Text>
          {producer != null && (
            <Text as="span" size="sm" tone="muted">
              {producer}
            </Text>
          )}
          <FactsReadout note={note} scale={scale} bpm={bpm} duration={duration} playing={playing} />
          {genre != null && (
            <div className="bt-player-details-section">
              <Text as="span" size="xs" tone="muted">
                Genre
              </Text>
              <div className="bt-player-details-tags">
                <Tag>{genre}</Tag>
              </div>
            </div>
          )}
          {moods.length > 0 && (
            <div className="bt-player-details-section">
              <Text as="span" size="xs" tone="muted">
                Moods
              </Text>
              <div className="bt-player-details-tags">
                {moods.map((mood) => (
                  <Tag key={mood}>{mood}</Tag>
                ))}
              </div>
            </div>
          )}
          {relatedArtists.length > 0 && (
            <div className="bt-player-details-section">
              <Text as="span" size="xs" tone="muted">
                Related artists
              </Text>
              <div className="bt-player-details-tags">
                {relatedArtists.map((artist) => (
                  <Tag key={artist}>{artist}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlayerDetails;
