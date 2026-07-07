// main/apps/web/src/client/features/player/visualizer/components/Equalizer.tsx
'use client';
import React, { useEffect, useRef, useSyncExternalStore, type RefObject } from 'react';

import type { Track } from '@shared/types/track';
import { useAudioAnalyser } from '@features/player/hooks/useAudioAnalyser';

import './Equalizer.css';

interface EqualizerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentTrack?: Track;
}

// No-op subscription: the canvas width is only read once (there's nothing to
// resubscribe to), but useSyncExternalStore still gives us the SSR-safe
// "render 203 on the server, reconcile to the real window width on the client" behavior.
const subscribeNoop = () => () => {};
const getCanvasWidthSnapshot = () => (window.innerWidth >= 767 ? 400 : 203);
const getServerCanvasWidthSnapshot = () => 203;

/** Live frequency-bar visualizer driven by the Web Audio analyser (amber, theme-driven). */
const Equalizer: React.FC<EqualizerProps> = ({ audioRef, currentTrack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const analyser = useAudioAnalyser(audioRef);

  const canvasWidth = useSyncExternalStore(
    subscribeNoop,
    getCanvasWidthSnapshot,
    getServerCanvasWidthSnapshot,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolve the bar color from the theme once (VU amber); cheap and stable.
    const barColor =
      getComputedStyle(canvas).getPropertyValue('--ui-color-primary').trim() || '#f2a33c';

    const frameLooper = () => {
      animationFrameId.current = requestAnimationFrame(frameLooper);
      const bins = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(bins);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = 2;
      const gapWidth = 1;
      const numBars = Math.floor((canvas.width + gapWidth) / (barWidth + gapWidth));
      ctx.fillStyle = barColor;
      for (let i = 0; i < numBars && i < bins.length; i++) {
        const barHeight = -(bins[i] / 2);
        const barPosX = i * (barWidth + gapWidth);
        ctx.fillRect(barPosX, canvas.height, barWidth, barHeight);
      }
    };

    frameLooper();
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, currentTrack]);

  return <canvas ref={canvasRef} className="bt-equalizer" width={canvasWidth} height={110} />;
};

export default Equalizer;
