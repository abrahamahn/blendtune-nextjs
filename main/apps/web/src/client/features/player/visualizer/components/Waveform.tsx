// main/apps/web/src/client/features/player/visualizer/components/Waveform.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { getCachedBuffer, setCachedBuffer } from "../utils/audioBufferCache";

import "./Waveform.css";

interface WaveformProps {
  audioUrl: string;
  amplitude: number;
  currentTime: number | undefined;
  trackDuration: number | undefined;
  width: number;
  updateCurrentTime: (newTime: number) => void;
}

const Waveform: React.FC<WaveformProps> = ({
  audioUrl,
  amplitude,
  currentTime,
  trackDuration,
  width,
  updateCurrentTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  // New refs for the fixed currentTime indicator while dragging.
  const currentLineRef = useRef<HTMLDivElement | null>(null);
  const currentTextRef = useRef<HTMLDivElement | null>(null);

  // Refs for fade-out timers.
  const fadeDelayTimeoutRef = useRef<number | null>(null);
  const fadeHideTimeoutRef = useRef<number | null>(null);

  // States
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  // Used only while dragging; after mouseUp we rely on currentTime.
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [hoverTimeVisible, setHoverTimeVisible] = useState(false);
  // This opacity state now affects the hover overlay text/line.
  const [hoverOpacity, setHoverOpacity] = useState(1);
  // New state for the fixed currentTime overlay opacity.
  const [fixedOpacity, setFixedOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  // When true the CSS transition is disabled so that the overlay appears immediately.
  const [disableTransition, setDisableTransition] = useState(false);
  // Store last position after drag to keep it visible during fade-out
  const [lastDragPosition, setLastDragPosition] = useState<number | null>(null);
  const [lastDragTime, setLastDragTime] = useState<string | null>(null);
  // Seek override for instant rendering on drag-end, cleared when the prop catches up
  // (React's sanctioned adjust-state-during-render pattern replaces the old prop-mirror effect).
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [prevPropTime, setPrevPropTime] = useState(currentTime);
  if (currentTime !== prevPropTime) {
    setPrevPropTime(currentTime);
    setSeekTime(null);
  }
  const localCurrentTime = seekTime ?? currentTime;

  const barWidth = 2;
  const gapWidth = 1;
  const numBars = Math.floor((width + gapWidth) / (barWidth + gapWidth));
  // Define a transition width (in pixels) for the spatial blending effect.
  const transitionWidth = 5;

  // Fetch & decode the audio offline.
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchDataAndDecode = async () => {
      try {
        const cached = getCachedBuffer(audioUrl);
        if (cached) {
          setAudioBuffer(cached);
          return;
        }

        const response = await fetch(audioUrl, { signal: controller.signal });
        const arrayBuffer = await response.arrayBuffer();

        type WindowWithVendorAudio = Window & {
          webkitOfflineAudioContext?: typeof OfflineAudioContext;
          webkitAudioContext?: typeof AudioContext;
        };
        const vendorWindow = window as WindowWithVendorAudio;

        let OfflineAudioContextClass: typeof OfflineAudioContext =
          window.OfflineAudioContext || vendorWindow.webkitOfflineAudioContext!;

        if (!OfflineAudioContextClass) {
          OfflineAudioContextClass = (window.AudioContext ||
            vendorWindow.webkitAudioContext) as unknown as typeof OfflineAudioContext;
        }

        const offlineCtx = new OfflineAudioContextClass(2, 44100 * 600, 44100);
        const decodedBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
        if (cancelled) return;
        setCachedBuffer(audioUrl, decodedBuffer);
        setAudioBuffer(decodedBuffer);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error loading audio (Waveform):", error);
      }
    };

    fetchDataAndDecode();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [audioUrl]);

  // Function to draw the waveform - extracted to be reusable
  const drawWaveform = useCallback(
    (time: number | undefined) => {
      const canvas = canvasRef.current;
      if (!canvas || !audioBuffer) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = 50;
      const data = audioBuffer.getChannelData(0);
      const sampleSize = Math.floor(data.length / numBars);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Colors come from the theme tokens (resolved per draw so the canvas
      // follows theme changes): VU amber for played bars, Seam for unplayed.
      const styles = getComputedStyle(canvas);
      const playedColor = styles.getPropertyValue("--ui-color-primary").trim();
      const unplayedColor = styles.getPropertyValue("--ui-color-border").trim();

      // Determine positions in pixels.
      const playbackPosition = (time! / (trackDuration || 1)) * canvas.width;

      // Loop over each bar to compute and render audio waveform.
      for (let i = 0; i < numBars; i++) {
        let sumSquared = 0;
        // Sum the squares of samples for RMS calculation.
        for (let j = 0; j < sampleSize; j++) {
          const sample = data[i * sampleSize + j] || 0;
          sumSquared += sample * sample;
        }
        const rms = Math.sqrt(sumSquared / sampleSize);
        // Scale the RMS to derive the base height for the bar.
        const baseBarHeight = rms * amplitude * canvas.height * 6;
        const offsetY = (canvas.height - baseBarHeight) / 2;
        const barX = i * (barWidth + gapWidth);

        /** Fills the current bar with a color at the given opacity. */
        const fillBar = (color: string, alpha = 1) => {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
          ctx.globalAlpha = 1;
        };

        // While dragging, the span between the playhead and the hover position
        // is a half-strength amber highlight; it wins over the played blend.
        const highlightStart = Math.min(hoverPosition, playbackPosition);
        const highlightEnd = Math.max(hoverPosition, playbackPosition);

        if (isDragging && barX >= highlightStart && barX < highlightEnd) {
          fillBar(playedColor, 0.5);
        } else if (barX < playbackPosition - transitionWidth) {
          // Fully played.
          fillBar(playedColor);
        } else if (barX < playbackPosition) {
          // Transition region: unplayed base with the played color fading in.
          fillBar(unplayedColor);
          fillBar(playedColor, (playbackPosition - barX) / transitionWidth);
        } else {
          // Unplayed.
          fillBar(unplayedColor);
        }
      }
    },
    [
      audioBuffer,
      width,
      amplitude,
      trackDuration,
      numBars,
      isDragging,
      hoverPosition,
      transitionWidth,
    ],
  );

  // Draw the waveform bars.
  useEffect(() => {
    drawWaveform(localCurrentTime);
  }, [localCurrentTime, drawWaveform]);

  // Cancel any pending fade-out timers.
  const cancelPendingFade = () => {
    if (fadeDelayTimeoutRef.current) {
      clearTimeout(fadeDelayTimeoutRef.current);
      fadeDelayTimeoutRef.current = null;
    }
    if (fadeHideTimeoutRef.current) {
      clearTimeout(fadeHideTimeoutRef.current);
      fadeHideTimeoutRef.current = null;
    }
  };

  // Update hover position and time indicator as mouse moves.
  const handleMouseMove = useCallback(
    (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current || !trackDuration) return;
      const rect = canvasRef.current.getBoundingClientRect();
      let offsetX = event.clientX - rect.left;
      offsetX = Math.max(0, Math.min(offsetX, rect.width));
      setHoverPosition(offsetX);

      // Compute time corresponding to current hover position.
      const percentage = offsetX / rect.width;
      const newTime = trackDuration * percentage;
      const timeString = `${Math.floor(newTime / 60)}:${Math.floor(newTime % 60)
        .toString()
        .padStart(2, "0")}`;
      setHoverTime(timeString);

      // Update hover line and text positions.
      if (lineRef.current) {
        // Update the hover line position (that follows the mouse).
        lineRef.current.style.left = `${offsetX}px`;
      }
      if (textRef.current) {
        textRef.current.style.left = `${offsetX + 5}px`;
      }
    },
    [trackDuration],
  );

  // Handle mouse down event on the waveform canvas.
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    // Cancel any fade (even if one is in progress).
    cancelPendingFade();
    setIsDragging(true);
    setHoverTimeVisible(true);
    setDisableTransition(true);
    setHoverOpacity(1);
    setFixedOpacity(1);
    handleMouseMove(event); // Immediate response.
  };

  // Handle mouse up event to finalize dragging and update playback.
  const handleMouseUp = useCallback(() => {
    if (!isDragging || !canvasRef.current || !trackDuration) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const percentage = hoverPosition / rect.width;
    const finalTime = trackDuration * percentage;

    // Save the last drag position and time before setting isDragging to false
    setLastDragPosition(hoverPosition);
    setLastDragTime(hoverTime);

    // Update local time immediately to update the waveform drawing
    setSeekTime(finalTime);

    // Update playback immediately.
    updateCurrentTime(finalTime);
    setIsDragging(false);

    // Initiate fade-out animation:
    // - Remain fully opaque for 2 seconds.
    // - Then fade opacity to 0 over the next 2 seconds.
    cancelPendingFade();
    fadeDelayTimeoutRef.current = window.setTimeout(() => {
      setDisableTransition(false);
      setHoverOpacity(0);
      setFixedOpacity(0);
      fadeHideTimeoutRef.current = window.setTimeout(() => {
        setHoverTimeVisible(false);
        setHoverTime(null);
        setLastDragPosition(null);
        setLastDragTime(null);
        // Reset for next interaction.
        setHoverOpacity(1);
        setFixedOpacity(1);
      }, 2000);
    }, 2000);
  }, [isDragging, hoverPosition, hoverTime, trackDuration, updateCurrentTime]);

  // Attach global mouse event listeners during drag operations.
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate playback position and formatted time for display.
  const playbackPositionPx =
    ((localCurrentTime ?? 0) / (trackDuration || 1)) * width;

  // Use last drag position after dragging is complete to keep indicator visible during fade-out
  const activePosition = isDragging
    ? hoverPosition
    : lastDragPosition !== null
      ? lastDragPosition
      : playbackPositionPx;

  const activeTimeText = isDragging
    ? hoverTime
    : lastDragTime !== null
      ? lastDragTime
      : `${Math.floor((localCurrentTime ?? 0) / 60)}:${Math.floor(
          (localCurrentTime ?? 0) % 60,
        )
          .toString()
          .padStart(2, "0")}`;

  return (
    <div className="bt-wave" onMouseDown={handleMouseDown}>
      <canvas ref={canvasRef} />
      <div ref={overlayRef} className="bt-wave-overlay" />
      {/* During dragging, render two overlays:
          1. The hover indicator (line and text) following the mouse (at ~75% opacity).
          2. A fixed currentTime indicator at playbackPosition (with its text 5px to the right).
          Both sets will fade out together after mouseUp.
      */}
      {hoverTimeVisible && (
        <>
          {/* Hover indicator (following mouse) */}
          <div
            ref={lineRef}
            className="bt-wave-line"
            style={{
              left: `${activePosition}px`,
              opacity: hoverOpacity,
              transition: disableTransition ? "none" : "opacity 2s ease-in-out",
            }}
          />
          <div
            ref={textRef}
            className="bt-wave-text"
            style={{
              left: `${activePosition + 5}px`,
              opacity: hoverOpacity,
              transition: disableTransition ? "none" : "opacity 2s ease-in-out",
            }}
          >
            {activeTimeText}
          </div>

          {/* Fixed currentTime indicator */}
          <div
            ref={currentLineRef}
            className="bt-wave-line"
            data-fixed="true"
            style={{
              left: `${playbackPositionPx}px`,
              opacity: fixedOpacity,
              transition: disableTransition ? "none" : "opacity 2s ease-in-out",
            }}
          />
          <div
            ref={currentTextRef}
            className="bt-wave-text"
            data-fixed="true"
            style={{
              left: `${playbackPositionPx + 5}px`,
              opacity: fixedOpacity,
              transition: disableTransition ? "none" : "opacity 2s ease-in-out",
            }}
          >
            {`${Math.floor((localCurrentTime ?? 0) / 60)}:${Math.floor(
              (localCurrentTime ?? 0) % 60,
            )
              .toString()
              .padStart(2, "0")}`}
          </div>
        </>
      )}
    </div>
  );
};

export default Waveform;
