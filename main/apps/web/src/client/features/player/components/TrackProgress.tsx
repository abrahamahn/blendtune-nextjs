// main/apps/web/src/client/features/player/components/TrackProgress.tsx
/**
 * Waveform + time display for the desktop player bar.
 */
import React, { useState, useRef, useEffect } from 'react';

import { Waveform } from '@features/player/visualizer';
import { formatTime } from '../utils/formatTime';
import { usePlayer } from '@client/features/player/services/playerService';
import { useTrackNavigation } from '@features/player/hooks';

import './player.css';

const TrackProgress: React.FC = () => {
  const { currentTrack, sharedAudioUrl, currentTime, trackDuration } = usePlayer();
  const { seekTo } = useTrackNavigation();
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState<number>(0);

  // Track the container width so the waveform redraws on resize.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWaveformWidth(entry.contentRect.width);
      }
    });

    if (waveformContainerRef.current) {
      resizeObserver.observe(waveformContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <div ref={waveformContainerRef} className="bt-player-wave">
        {currentTrack?.file && sharedAudioUrl ? (
          <Waveform
            audioUrl={sharedAudioUrl}
            amplitude={0.5}
            currentTime={currentTime || 0}
            trackDuration={trackDuration || 0}
            width={waveformWidth}
            updateCurrentTime={(newTime: number) => {
              seekTo(newTime);
            }}
          />
        ) : null}
      </div>
      <p className="bt-player-time">
        {formatTime(currentTime)} <span>/ {formatTime(trackDuration)}</span>
      </p>
    </>
  );
};

export default TrackProgress;
