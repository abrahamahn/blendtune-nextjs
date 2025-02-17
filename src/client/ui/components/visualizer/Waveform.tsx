"use client";
import React, { useEffect, useRef, useState, RefObject } from "react";

interface WaveformProps {
  audioUrl: string;                    // Shared blob URL
  audioRef: RefObject<HTMLAudioElement | null>; 
  amplitude: number;                   // Multiplier for waveform height
  currentTime: number | undefined;     // Current playback position (in seconds)
  trackDuration: number | undefined;   // Total duration of the track (in seconds)
  width: number;                       // Width of the waveform canvas
  updateCurrentTime: (newTime: number) => void;  // Callback for seeking
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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [hoverTime, setHoverTime] = useState<string>("");
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);

  const barWidth = 2;
  const gapWidth = 1;
  const numBars = Math.floor((width + gapWidth) / (barWidth + gapWidth));

  // Fetch & decode the audio offline
  useEffect(() => {
    const fetchDataAndDecode = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        let OfflineAudioContextClass =
          (window as any).OfflineAudioContext ||
          (window as any).webkitOfflineAudioContext;

        if (!OfflineAudioContextClass) {
          OfflineAudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
        }

        const offlineCtx = new OfflineAudioContextClass(2, 44100 * 600, 44100);
        const decodedBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
        setAudioBuffer(decodedBuffer);
      } catch (error) {
        console.error("Error loading audio (Waveform):", error);
      }
    };

    fetchDataAndDecode();
  }, [audioUrl]);

  // Draw the waveform bars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = 50;
    const data = audioBuffer.getChannelData(0);
    const sampleSize = Math.floor(data.length / numBars);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numBars; i++) {
      let sumSquared = 0;
      for (let j = 0; j < sampleSize; j++) {
        const sample = data[i * sampleSize + j] || 0;
        sumSquared += sample * sample;
      }
      const rms = Math.sqrt(sumSquared / sampleSize);
      const baseBarHeight = rms * amplitude * canvas.height * 6;
      const offsetY = (canvas.height - baseBarHeight) / 2;
      const barPosition = i * (barWidth + gapWidth);
      const barEndTime = trackDuration
        ? ((barPosition + barWidth) * trackDuration) /
          (numBars * (barWidth + gapWidth))
        : 0;
      const passed = barEndTime < (currentTime || 0);
      ctx.fillStyle = passed ? "#2563EB" : "#848484";
      ctx.fillRect(barPosition, offsetY, barWidth, baseBarHeight);
    }
  }, [width, audioBuffer, amplitude, currentTime, trackDuration, numBars]);

  // Hover & click interactions for seeking
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const overlay = overlayRef.current;
    const line = lineRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !line || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    if (offsetX >= 0 && offsetX <= rect.width && offsetY >= 0 && offsetY <= rect.height) {
      const percentage = (offsetX / rect.width) * 100;
      const timeInSeconds = (trackDuration || 0) * (percentage / 100);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const hoverTimeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      setHoverPosition(offsetX);
      setHoverTime(hoverTimeString);
      line.style.left = `${offsetX}px`;
      line.style.visibility = "visible";
      line.style.opacity = "1";
      if (event.type === "click") {
        updateCurrentTime(timeInSeconds);
        if (audioRef.current) {
          audioRef.current.currentTime = timeInSeconds;
        }
      }
    } else {
      setHoverTime("");
      line.style.visibility = "hidden";
      line.style.opacity = "0";
    }
  };

  return (
    <div
      className="relative w-full h-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} />
      <div
        ref={overlayRef}
        className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
        onMouseMove={handleMouseMove}
        onClick={handleMouseMove}
      />
      {audioBuffer && currentTime !== undefined && (
        <div
          className="absolute top-0 bottom-0 border-l border-white pointer-events-none"
          style={{
            left: `${(currentTime / (trackDuration || 1)) * 100}%`,
          }}
        />
      )}
      {isHovering && (
        <>
          <div
            ref={lineRef}
            className="absolute top-0 bottom-0 border-l border-black dark:border-white pointer-events-none transition-opacity duration-300"
            style={{ left: `${hoverPosition}px`, opacity: 0 }}
          />
          {hoverTime && (
            <div
              className="absolute top-0 left-0 mt-1 ml-1 text-black dark:text-white text-2xs pointer-events-none transition-opacity"
              style={{ top: "0", left: `${hoverPosition + 5}px` }}
            >
              {hoverTime}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Waveform;
