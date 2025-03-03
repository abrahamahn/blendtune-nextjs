// src/client/features/sounds/visualizer/components/Waveform.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback, RefObject } from "react";

interface WaveformProps {
  audioUrl: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  amplitude: number;
  currentTime: number | undefined;
  trackDuration: number | undefined;
  width: number;
  updateCurrentTime: (newTime: number) => void;
}

const Waveform: React.FC<WaveformProps> = ({
  audioUrl,
  audioRef,
  amplitude,
  currentTime,
  trackDuration,
  width,
  updateCurrentTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // (Other refs and states remain the same)
  const [waveform, setWaveform] = useState<number[] | null>(null);
  const barWidth = 2;
  const gapWidth = 1;
  const numBars = Math.floor((width + gapWidth) / (barWidth + gapWidth));
  const transitionWidth = 5; // pixels for blending effect

  // Fetch and decode audio on main thread, then process via worker.
  useEffect(() => {
    const fetchAndProcess = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decode audio on main thread using AudioContext.
        const audioCtx = new (window.AudioContext || window.AudioContext)();
        const decodedData = await audioCtx.decodeAudioData(arrayBuffer);
        const channelData = decodedData.getChannelData(0); // Use first channel

        // Create the worker instance.
        const worker = new Worker(
          new URL("../workers/audioWorker.ts", import.meta.url)
        );
        // Transfer the underlying ArrayBuffer of the Float32Array.
        worker.postMessage(
          {
            channelData: channelData.buffer,
            numBars: numBars,
          },
          [channelData.buffer]
        );

        worker.onmessage = (event) => {
          if (event.data.error) {
            console.error("Error processing audio data in worker:", event.data.error);
          } else {
            setWaveform(event.data.waveformData);
          }
          worker.terminate();
        };
      } catch (error) {
        console.error("Error loading audio (Waveform):", error);
      }
    };

    fetchAndProcess();
  }, [audioUrl, numBars]);

  // Draw the waveform using the precomputed data.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveform) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = 50;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const playbackPosition = (currentTime! / (trackDuration || 1)) * canvas.width;

    for (let i = 0; i < waveform.length; i++) {
      const rms = waveform[i];
      const baseBarHeight = rms * amplitude * canvas.height * 6;
      const offsetY = (canvas.height - baseBarHeight) / 2;
      const barX = i * (barWidth + gapWidth);

      // Create gradients for played/unplayed portions.
      const gradient = ctx.createLinearGradient(0, offsetY, 0, offsetY + baseBarHeight);
      gradient.addColorStop(1, "rgb(0,60,255)");
      gradient.addColorStop(0, "rgb(0,120,255)");

      const greyGradient = ctx.createLinearGradient(0, offsetY, 0, offsetY + baseBarHeight);
      const isDarkMode =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        greyGradient.addColorStop(1, "rgb(100,100,100)");
        greyGradient.addColorStop(0, "rgb(150,150,150)");
      } else {
        greyGradient.addColorStop(1, "rgb(180,180,180)");
        greyGradient.addColorStop(0, "rgb(190,190,190)");
      }

      if (barX < playbackPosition - transitionWidth) {
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
      } else if (barX >= playbackPosition - transitionWidth && barX < playbackPosition) {
        ctx.fillStyle = greyGradient;
        ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
        const alpha = (playbackPosition - barX) / transitionWidth;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = greyGradient;
        ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
      }
    }
  }, [width, waveform, amplitude, currentTime, trackDuration, numBars, transitionWidth]);

  return <canvas ref={canvasRef} />;
};

export default Waveform;
