// main/apps/web/src/client/features/layout/rightbar/components/NowPlaying.tsx
'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faForwardStep, faRepeat, faShuffle } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@ui';
import { Artwork, FactsReadout, PlayButton, artworkSrc, present } from '@client/components';
import { usePlayer } from '@client/features/player/services/playerService';
import { usePlayerControls } from '@features/player/hooks';
import { Equalizer } from '@features/player/visualizer';

/** m:ss from seconds. */
const mmss = (s: number | undefined): string => {
  const t = Math.max(0, Math.floor(s ?? 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

/** The now-playing surface: artwork, transport, progress — Spotify-mobile in a desktop panel. */
const NowPlaying: React.FC = () => {
  const { currentTrack, isPlaying, currentTime, trackDuration, audioRef, loopMode } = usePlayer();
  const { togglePlayPause, previousTrack, nextTrack, loopTrack } = usePlayerControls();

  if (!currentTrack) {
    return (
      <div className="bt-np-empty">
        <FontAwesomeIcon icon={faShuffle} />
        <p>Pick a beat to start listening.</p>
      </div>
    );
  }

  const title = present(currentTrack.metadata.title) ?? currentTrack.metadata.catalog;
  const producer = present(currentTrack.metadata.producer);
  const duration = trackDuration ?? 0;
  const pct = duration ? ((currentTime ?? 0) / duration) * 100 : 0;

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  };

  return (
    <div className="bt-np">
      <div className="bt-np-art">
        <Artwork src={artworkSrc(currentTrack)} alt={`${title} artwork`} />
        <div className="bt-np-eq" aria-hidden>
          <Equalizer audioRef={audioRef} currentTrack={currentTrack} />
        </div>
      </div>

      <div className="bt-np-meta">
        <h2 className="bt-np-title bt-display">{title}</h2>
        {producer && <p className="bt-np-producer">{producer}</p>}
        <FactsReadout
          note={currentTrack.info.key.note}
          scale={currentTrack.info.key.scale}
          bpm={currentTrack.info.bpm}
          duration={currentTrack.info.duration}
          playing={isPlaying}
        />
      </div>

      <div className="bt-np-progress">
        <div
          className="bt-np-track"
          onClick={seek}
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <div className="bt-np-fill" style={{ width: `${pct}%` }}>
            <span className="bt-np-thumb" />
          </div>
        </div>
        <div className="bt-np-times">
          <span>{mmss(currentTime)}</span>
          <span>{mmss(duration)}</span>
        </div>
      </div>

      <div className="bt-np-transport">
        <Button variant="text" size="inline" className="bt-np-icon" aria-label="Shuffle" disabled>
          <FontAwesomeIcon icon={faShuffle} />
        </Button>
        <Button
          variant="text"
          size="inline"
          className="bt-np-icon"
          onClick={previousTrack}
          aria-label="Previous track"
        >
          <FontAwesomeIcon icon={faBackwardStep} />
        </Button>
        <PlayButton playing={isPlaying} size="lg" onClick={togglePlayPause} />
        <Button
          variant="text"
          size="inline"
          className="bt-np-icon"
          onClick={nextTrack}
          aria-label="Next track"
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </Button>
        <Button
          variant="text"
          size="inline"
          className={`bt-np-icon${loopMode !== 'off' ? ' bt-np-icon-active' : ''}`}
          onClick={loopTrack}
          aria-label="Repeat"
          aria-pressed={loopMode !== 'off'}
        >
          <FontAwesomeIcon icon={faRepeat} />
        </Button>
      </div>
    </div>
  );
};

export default NowPlaying;
