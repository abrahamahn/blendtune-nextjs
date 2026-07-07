// main/apps/web/src/client/features/sounds/hero/components/Hero.tsx
/**
 * Sounds-page hero: the current track, playable in one click.
 * The thesis is sound — artwork, title, facts readout, play. Nothing else.
 */
import React from 'react';

import { Text } from '@ui';
import { Artwork, FactsReadout, PlayButton, Tag, artworkSrc, present, trackFacts, trackTags } from '@client/components';
import { usePlayer } from '@features/player/services/playerService';
import { usePlayerControls } from '@features/player/hooks';

import './Hero.css';

const Hero: React.FC = () => {
  const { currentTrack, isPlaying } = usePlayer();
  const { togglePlayPause } = usePlayerControls();

  if (!currentTrack) return null;

  const { note, scale, bpm, duration } = trackFacts(currentTrack);
  const tags = trackTags(currentTrack);
  const producer = present(currentTrack.metadata.producer);
  const typeArtist = present(currentTrack.info.relatedartist[0]);

  return (
    <section className="bt-hero" aria-label="Now playing">
      <span className="bt-hero-art">
        <Artwork src={artworkSrc(currentTrack)} alt={currentTrack.metadata.title} />
        <PlayButton
          playing={isPlaying}
          size="lg"
          onClick={togglePlayPause}
          className="bt-hero-play"
        />
      </span>
      <div className="bt-hero-id">
        <Text as="span" className="bt-display bt-hero-title">
          {currentTrack.metadata.title}
          {typeArtist != null && ` [${typeArtist}]`}
        </Text>
        {producer != null && (
          <Text as="span" size="sm" tone="muted">
            {producer}
          </Text>
        )}
        <FactsReadout note={note} scale={scale} bpm={bpm} duration={duration} playing={isPlaying} />
        {tags.length > 0 && (
          <span className="bt-hero-tags">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </span>
        )}
      </div>
    </section>
  );
};

export default Hero;
