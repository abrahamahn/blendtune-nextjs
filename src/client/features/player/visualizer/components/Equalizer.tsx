// src/client/features/sounds/visualizer/components/Equalizer.tsx
"use client";
import React, { useEffect, useRef, useState, RefObject } from "react";
import { Track } from "@/shared/types/track";
import { useAudioAnalyser } from "@player/hooks/useAudioAnalyser";

interface EqualizerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentTrack?: Track;
}

const Equalizer: React.FC<EqualizerProps> = ({ audioRef, currentTrack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const prefersDarkMode = useRef<boolean>(false);
  const analyser = useAudioAnalyser(audioRef);

  const [canvasWidth, setCanvasWidth] = useState(203);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanvasWidth(window.innerWidth >= 767 ? 400 : 203);
    }
  }, []);

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

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const setupEqualizer = () => {
      if (analyser && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const frameLooper = () => {
          animationFrameId.current = requestAnimationFrame(frameLooper);
          const fbc_array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(fbc_array);

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = 2;
            const gapWidth = 1;
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
  }, [analyser, currentTrack, getBarColor]);

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
