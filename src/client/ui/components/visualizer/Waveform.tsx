"use client";

import React, { useEffect, useRef, useState, RefObject } from "react";

// Props for the Waveform
interface WaveformProps {
  audioUrl: string;                    // The URL of the audio file to visualize
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
  // Refs for the canvas and hover overlay
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // Store the decoded audio data
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  // Hover UI state
  const [hoverTime, setHoverTime] = useState<string>("");
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);

  // Some local constants for the waveform bars
  const barWidth = 2;
  const gapWidth = 1;
  const numBars = Math.floor((width + gapWidth) / (barWidth + gapWidth));

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Fetch & decode the audio offline. This does NOT require a user gesture.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDataAndDecode = async () => {
      try {
        // 1) Fetch the audio file
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        // 2) Create an OfflineAudioContext to decode without user interaction
        let OfflineAudioContextClass =
          (window as any).OfflineAudioContext ||
          (window as any).webkitOfflineAudioContext;

        if (!OfflineAudioContextClass) {
          // Fallback: use a normal AudioContext just for decoding (usually works)
          // but can fail on Safari iOS unless there's a user gesture.
          OfflineAudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
        }

        // Create an offline context big enough to decode entire audio
        //  - 2 channels, sampleRate = 44100, length = 44100*600 for 10 min
        const offlineCtx = new OfflineAudioContextClass(2, 44100 * 600, 44100);

        // 3) Decode the entire audio file offline
        const decodedBuffer = await offlineCtx.decodeAudioData(arrayBuffer);

        // 4) Store the decoded AudioBuffer for rendering
        setAudioBuffer(decodedBuffer);
      } catch (error) {
        console.error("Error loading audio (Waveform):", error);
      }
    };

    fetchDataAndDecode();
  }, [audioUrl]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Draw the waveform bars whenever relevant state changes
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = 50; // Arbitrary fixed height for the waveform

    const data = audioBuffer.getChannelData(0); // Left channel
    const sampleSize = Math.floor(data.length / numBars);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bars
    for (let i = 0; i < numBars; i++) {
      let sumSquared = 0;
      // Average out a chunk of samples for each bar
      for (let j = 0; j < sampleSize; j++) {
        const sample = data[i * sampleSize + j] || 0;
        sumSquared += sample * sample;
      }
      const rms = Math.sqrt(sumSquared / sampleSize);

      // Convert RMS to a bar height
      const baseBarHeight = rms * amplitude * canvas.height * 6;
      const offsetY = (canvas.height - baseBarHeight) / 2;

      // Determine if this bar is before the currentTime
      const barPosition = i * (barWidth + gapWidth);
      const barEndTime = trackDuration
        ? ((barPosition + barWidth) * trackDuration) /
          (numBars * (barWidth + gapWidth))
        : 0;
      const passed = barEndTime < (currentTime || 0);

      // Fill color: Blue (#2563EB) for “passed”, Gray (#848484) for future
      ctx.fillStyle = passed ? "#2563EB" : "#848484";

      // Draw the bar
      ctx.fillRect(barPosition, offsetY, barWidth, baseBarHeight);
    }
  }, [width, audioBuffer, amplitude, currentTime, trackDuration, numBars]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) Hover & click interactions for seeking
  // ─────────────────────────────────────────────────────────────────────────────
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

    // If the mouse is inside the canvas:
    if (offsetX >= 0 && offsetX <= rect.width && offsetY >= 0 && offsetY <= rect.height) {
      // Calculate the timeline percentage & hovered time
      const percentage = (offsetX / rect.width) * 100;
      const timeInSeconds = (trackDuration || 0) * (percentage / 100);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const hoverTimeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      // Update line position & label
      setHoverPosition(offsetX);
      setHoverTime(hoverTimeString);

      line.style.left = `${offsetX}px`;
      line.style.visibility = "visible";
      line.style.opacity = "1";

      // Handle click -> jump
      if (event.type === "click") {
        updateCurrentTime(timeInSeconds);

        // If there's an <audio> element, seek it
        if (audioRef.current) {
          audioRef.current.currentTime = timeInSeconds;
        }
      }
    } else {
      // Outside canvas => hide
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
      {/* Waveform Canvas */}
      <canvas ref={canvasRef} />

      {/* Overlay div for capturing mouse events (separate from canvas) */}
      <div
        ref={overlayRef}
        className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
        onMouseMove={handleMouseMove}
        onClick={handleMouseMove}
      />

      {/* Progress Line (drawn only if we have a decoded buffer) */}
      {audioBuffer && currentTime !== undefined && (
        <div
          className="absolute top-0 bottom-0 border-l border-white pointer-events-none"
          style={{
            left: `${(currentTime / (trackDuration || 1)) * 100}%`,
          }}
        />
      )}

      {/* Hover line & time tooltip */}
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
