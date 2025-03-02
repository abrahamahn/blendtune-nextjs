/**
 * @fileoverview Component for track waveform and time display
 * @module features/player/components/TrackProgress
 */

import React, { useState, useRef, useEffect } from "react";
import Waveform from "@visualizer/components/Waveform";
import { formatTime } from "../utils/formatTime";
import { usePlayer } from "@/client/features/player/services/playerService";
import { useTrackNavigation } from "@player/hooks";

/**
 * Displays track progress with waveform visualization and time display
 */
export const TrackProgress: React.FC = () => {
  const { audioRef, currentTrack, sharedAudioUrl, currentTime, trackDuration, dispatch } = usePlayer();
  const { seekTo } = useTrackNavigation();
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState<number>(0);

  // Resize observer for waveform width
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
      <div ref={waveformContainerRef} className="flex-1 min-w-0 overflow-hidden">
        {currentTrack?.file && sharedAudioUrl ? (
          <Waveform
            audioUrl={sharedAudioUrl}
            audioRef={audioRef}
            amplitude={0.5}
            currentTime={audioRef.current?.currentTime || 0}
            trackDuration={audioRef.current?.duration || 0}
            width={waveformWidth}
            updateCurrentTime={(newTime: number) => {
              seekTo(newTime);
            }}
          />
        ) : (
          <p />
        )}
      </div>
      <div className="hidden lg:flex text-xs ml-2 w-20 h-full shrink-0 items-center justify-center user-select-none">
        <p className="text-[#1F1F1F] dark:text-white">
          {formatTime(audioRef.current?.currentTime)}
          <span className="text-transparent"> / </span>
          <span className="text-[#070707] dark:text-neutral-500">
            {formatTime(trackDuration)}
          </span>
        </p>
      </div>
    </>
  );
};

export default TrackProgress;