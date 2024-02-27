import React, { useEffect, useRef, useState, RefObject } from "react";
import { Track } from "@/types/track";

interface AudioElementWithSourceNode extends HTMLAudioElement {
  sourceNode?: MediaElementAudioSourceNode;
  analyser?: AnalyserNode;
}

interface EqualizerProps {
  audioRef: RefObject<HTMLAudioElement>;
  currentTrack?: Track;
  width: number;
}

const Equalizer: React.FC<EqualizerProps> = ({
  audioRef,
  currentTrack,
  width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const prefersDarkMode = useRef<boolean>(false);
  const [canvasWidth, setCanvasWidth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 767 ? 400 : 203;
    } else {
      return 203;
    }
  });

  useEffect(() => {
    const matchDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    prefersDarkMode.current = matchDarkMode;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersDarkMode.current = e.matches;
    };
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const getBarColor = () => (prefersDarkMode.current ? "#ECECEC" : "#A9A9A9");

  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) => {
      prefersDarkMode.current = e.matches;
    };
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addListener(handleChange);

    if (
      audioRef.current &&
      !(audioRef.current as AudioElementWithSourceNode).sourceNode
    ) {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const sourceNode = audioCtx.createMediaElementSource(audioRef.current);
      const analyser = audioCtx.createAnalyser();

      const extendedAudioRef = audioRef.current as AudioElementWithSourceNode;
      extendedAudioRef.sourceNode = sourceNode;
      extendedAudioRef.analyser = analyser;

      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    const setupEqualizer = () => {
      const extendedAudioRef = audioRef.current as AudioElementWithSourceNode;
      if (extendedAudioRef?.analyser && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const analyser = extendedAudioRef.analyser;

        const frameLooper = () => {
          animationFrameId.current = requestAnimationFrame(frameLooper);
          const fbc_array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(fbc_array);

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = 2;
            const gap = 1;
            const barPlusGap = barWidth + gap;

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

    if (audioRef.current) {
      setupEqualizer();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      mediaQuery.removeListener(handleChange);
    };
  }, [audioRef, currentTrack]);

  useEffect(() => {
    // Instead of the previous handleResize
    if (canvasRef.current) {
      canvasRef.current.width = width; // Use the passed width prop
      setCanvasWidth(width);
    }
  }, [width]);

  return (
    <canvas
      className="flex items-center justify-center w-full h-full"
      ref={canvasRef}
      width={canvasWidth}
      height={110}
    ></canvas>
  );
};

export default Equalizer;
