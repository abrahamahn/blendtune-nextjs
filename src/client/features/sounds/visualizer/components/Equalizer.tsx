// src\client\features\sounds\visualizer\components\Equalizer.tsx
"use client";
import React, { useEffect, useRef, useState, RefObject } from "react";
import { Track } from "@/shared/types/track";

interface AudioElementWithSourceNode extends HTMLAudioElement {
  sourceNode?: MediaElementAudioSourceNode;
  analyser?: AnalyserNode;
}

interface EqualizerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentTrack?: Track;
}

const Equalizer: React.FC<EqualizerProps> = ({ audioRef, currentTrack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const prefersDarkMode = useRef<boolean>(false);

  // Use a safe default width (203) for SSR; update on mount if needed.
  const [canvasWidth, setCanvasWidth] = useState(203);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanvasWidth(window.innerWidth >= 767 ? 400 : 203);
    }
  }, []);

  // Listen for dark mode changes.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDarkMode.current = mediaQuery.matches;
    const handleChange = (e: MediaQueryListEvent) => {
      prefersDarkMode.current = e.matches;
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const getBarColor = () => (prefersDarkMode.current ? "#ECECEC" : "#A9A9A9");

  // Set up the audio analyser and rendering loop.
  useEffect(() => {
    if (!audioRef.current) return;

    const extendedAudioRef = audioRef.current as AudioElementWithSourceNode;
    if (!extendedAudioRef.sourceNode) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const sourceNode = audioCtx.createMediaElementSource(audioRef.current);
      const analyser = audioCtx.createAnalyser();

      extendedAudioRef.sourceNode = sourceNode;
      extendedAudioRef.analyser = analyser;
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    const setupEqualizer = () => {
      if (extendedAudioRef.analyser && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const analyser = extendedAudioRef.analyser;

        const frameLooper = () => {
          animationFrameId.current = requestAnimationFrame(frameLooper);
          const fbc_array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(fbc_array);

          if (ctx) {
            // Clear canvas for fresh rendering
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Use identical fixed values as in Waveform.
            const barWidth = 2;
            const gapWidth = 1;
            // Calculate the number of bars as done in the Waveform component.
            const numBars = Math.floor((canvas.width + gapWidth) / (barWidth + gapWidth));

            for (let i = 0; i < numBars && i < fbc_array.length; i++) {
              const barHeight = -(fbc_array[i] / 2);
              const barPosX = i * (barWidth + gapWidth);
              ctx.fillStyle = getBarColor();
              ctx.fillRect(barPosX, canvas.height, barWidth, barHeight);
            }
          }
        };

        frameLooper();
      }
    };

    setupEqualizer();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [audioRef, currentTrack]);

  return (
    <canvas
      ref={canvasRef}
      className="flex items-center justify-center w-full h-full"
      width={canvasWidth}
      height={110}
    />
  );
};

export default Equalizer;
