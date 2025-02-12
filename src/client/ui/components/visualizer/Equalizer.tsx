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
  // ❌ width prop removed
}

const Equalizer: React.FC<EqualizerProps> = ({ audioRef, currentTrack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const prefersDarkMode = useRef<boolean>(false);

  // 1️⃣ Start with a safe SSR default (203). Matches server & client initially.
  const [canvasWidth, setCanvasWidth] = useState(203);

  // 2️⃣ On client mount, check screen size & update to 400 if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanvasWidth(window.innerWidth >= 767 ? 400 : 203);
    }
  }, []);

  // 3️⃣ Watch the user's dark mode preference
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

  // 4️⃣ Set up audio analyser
  useEffect(() => {
    if (!audioRef.current) return; // No audio element yet

    const extendedAudioRef = audioRef.current as AudioElementWithSourceNode;
    if (!extendedAudioRef.sourceNode) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
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
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = 2;
            const gap = 1;
            const barPlusGap = barWidth + gap;

            // Use canvas.width for dynamic barCount
            const barCount = Math.floor(canvas.width / barPlusGap);

            for (let i = 0; i < barCount; i++) {
              const barHeight = -(fbc_array[i] / 2);
              const barPosX = i * barPlusGap;
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
      // Cleanup animation frames
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [audioRef, currentTrack]);

  return (
    <canvas
      ref={canvasRef}
      className="flex items-center justify-center w-full h-full"
      // 5️⃣ SSR & initial client width is 203, updated in useEffect if large screen
      width={canvasWidth}
      height={110}
    />
  );
};

export default Equalizer;
