"use client";

import React, { useEffect, useRef, useState, RefObject } from "react";

// Props for the Waveform component
interface WaveformProps {
  audioUrl: string;                    // URL of the audio file to visualize
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
  // Refs for canvas and overlay elements
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // State for computed waveform data (array of bar heights)
  const [waveformData, setWaveformData] = useState<number[] | null>(null);
  // State for decoded channel data (optional, if you need it elsewhere)
  // const [decodedChannelData, setDecodedChannelData] = useState<Float32Array | null>(null);

  // Hover UI state
  const [hoverTime, setHoverTime] = useState<string>("");
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);

  // Constants for waveform bars
  const barWidth = 2;
  const gapWidth = 1;
  const numBars = Math.floor((width + gapWidth) / (barWidth + gapWidth));

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Decode the audio file on the main thread and offload RMS computation to worker
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAndDecode = async () => {
      try {
        // Fetch the audio file
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Get the OfflineAudioContext constructor (or fallback to AudioContext)
        const OfflineAudioContextClass =
          (window as any).OfflineAudioContext ||
          (window as any).webkitOfflineAudioContext ||
          window.AudioContext;
        if (!OfflineAudioContextClass) {
          throw new Error("OfflineAudioContext is not supported in this environment.");
        }

        // Create an offline context.
        // We assume 2 channels, 44100 sample rate, and enough length for 10 minutes.
        const offlineCtx = new OfflineAudioContextClass(2, 44100 * 600, 44100);

        // Decode the audio
        const decodedBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
        console.log("[Waveform] Audio decoded");

        // Extract left channel data
        const channelData = decodedBuffer.getChannelData(0);
        // Optionally: setDecodedChannelData(new Float32Array(channelData));
        
        // Offload RMS calculation to the worker:
        const worker = new Worker("/waveformWorker.mjs", { type: "module" });
        // Transfer the underlying buffer for efficiency
        worker.postMessage(
          { channelDataBuffer: channelData.buffer, numBars, amplitude },
          [channelData.buffer]
        );
        worker.onmessage = (event) => {
          const { waveformData, error } = event.data;
          if (error) {
            console.error("[Waveform] Worker error:", error);
          } else {
            console.log("[Waveform] Received waveformData:", waveformData);
            setWaveformData(waveformData);
          }
          worker.terminate();
        };
      } catch (error) {
        console.error("Error in fetchAndDecode (Waveform):", error);
      }
    };

    fetchAndDecode();
  }, [audioUrl, numBars, amplitude]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Draw the waveform on the canvas when waveformData or related state changes
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = 50; // Fixed height

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numBars; i++) {
      const barHeight = waveformData[i] || 0;
      const offsetY = (canvas.height - barHeight) / 2;
      const barPosition = i * (barWidth + gapWidth);

      const barEndTime = trackDuration
        ? ((barPosition + barWidth) * trackDuration) / (numBars * (barWidth + gapWidth))
        : 0;
      const passed = barEndTime < (currentTime || 0);

      ctx.fillStyle = passed ? "#2563EB" : "#848484";
      ctx.fillRect(barPosition, offsetY, barWidth, barHeight);
    }
  }, [width, waveformData, numBars, barWidth, gapWidth, currentTime, trackDuration]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) Hover and click interactions for seeking
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

    if (offsetX >= 0 && offsetX <= rect.width && offsetY >= 0 && offsetY <= rect.height) {
      const percentage = offsetX / rect.width;
      const timeInSeconds = (trackDuration || 0) * percentage;
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
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div
        ref={overlayRef}
        className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
        onMouseMove={handleMouseMove}
        onClick={handleMouseMove}
      />
      {waveformData && currentTime !== undefined && (
        <div
          className="absolute top-0 bottom-0 border-l border-white pointer-events-none"
          style={{ left: `${(currentTime / (trackDuration || 1)) * 100}%` }}
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
