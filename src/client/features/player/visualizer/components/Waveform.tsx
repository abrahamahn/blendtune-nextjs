"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  RefObject,
} from "react";

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
  // Local time state to allow instant rendering updates
  const [localCurrentTime, setLocalCurrentTime] = useState<number | undefined>(currentTime);

  const barWidth = 2;
  const gapWidth = 1;
  const numBars = Math.floor((width + gapWidth) / (barWidth + gapWidth));
  // Define a transition width (in pixels) for the spatial blending effect.
  const transitionWidth = 5;

  // Update local time when prop changes
  useEffect(() => {
    setLocalCurrentTime(currentTime);
  }, [currentTime]);

  // Fetch & decode the audio offline.
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

  // Function to draw the waveform - extracted to be reusable
  const drawWaveform = useCallback((time: number | undefined) => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = 50;
    const data = audioBuffer.getChannelData(0);
    const sampleSize = Math.floor(data.length / numBars);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      // Create a vertical gradient (color B) for a fully played bar.
      const gradient = ctx.createLinearGradient(0, offsetY, 0, offsetY + baseBarHeight);
      // (Note: we reverse the color stops so that when blended, the alpha "fades in"—adjust as desired.)
      gradient.addColorStop(1, "rgb(0,60,255)");
      gradient.addColorStop(0, "rgb(0,120,255)");
      // Create a grey gradient for the unplayed region.
      const greyGradient = ctx.createLinearGradient(0, offsetY, 0, offsetY + baseBarHeight);

      // Check if the user prefers dark mode.
      const isDarkMode =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (isDarkMode) {
        // Use your current dark mode colors.
        greyGradient.addColorStop(1, "rgb(100,100,100)");
        greyGradient.addColorStop(0, "rgb(150,150,150)");
      } else {
        // Lighter colors for light mode (adjust these values as desired).
        greyGradient.addColorStop(1, "rgb(180,180,180)");
        greyGradient.addColorStop(0, "rgb(190,190,190)");
      }

      if (!isDragging) {
        // Not dragging: smoothly blend from played (gradient) to unplayed (greyGradient)
        if (barX < playbackPosition - transitionWidth) {
          // Fully played.
          ctx.fillStyle = gradient;
          ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
        } else if (barX >= playbackPosition - transitionWidth && barX < playbackPosition) {
          // In the transition region: first draw greyGradient, then overlay gradient with alpha.
          ctx.fillStyle = greyGradient;
          ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
          const alpha = (playbackPosition - barX) / transitionWidth; // goes 0->1 as barX goes from playbackPosition to playbackPosition - transitionWidth
          ctx.globalAlpha = alpha;
          ctx.fillStyle = gradient;
          ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
          ctx.globalAlpha = 1;
        } else {
          // Unplayed.
          ctx.fillStyle = greyGradient;
          ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
        }
      } else {
        // Dragging: we also show a highlight region.
        if (hoverPosition > playbackPosition) {
          // Dragging forward:
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
          } else if (barX >= playbackPosition && barX < hoverPosition) {
            // Highlighted (tertiary) region.
            ctx.fillStyle = "rgba(0,120,255,0.5)";
            ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
          } else {
            ctx.fillStyle = greyGradient;
            ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
          }
        } else if (hoverPosition < playbackPosition) {
          // Dragging backward:
          if (barX < hoverPosition) {
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
            }
          } else if (barX >= hoverPosition && barX < playbackPosition) {
            ctx.fillStyle = "rgba(0,120,255,0.5)";
            ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
          } else {
            ctx.fillStyle = greyGradient;
            ctx.fillRect(barX, offsetY, barWidth, baseBarHeight);
          }
        } else {
          // hoverPosition equals playbackPosition.
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
      }
    }
  }, [audioBuffer, width, amplitude, trackDuration, numBars, isDragging, hoverPosition, transitionWidth]);

  // Draw the waveform bars.
  useEffect(() => {
    drawWaveform(localCurrentTime);
  }, [
    localCurrentTime,
    drawWaveform
  ]);

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
    [trackDuration]
  );

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
    setLocalCurrentTime(finalTime);
    
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
  const playbackPositionPx = ((localCurrentTime ?? 0) / (trackDuration || 1)) * width;
  
  // Use last drag position after dragging is complete to keep indicator visible during fade-out
  const activePosition = isDragging 
    ? hoverPosition 
    : (lastDragPosition !== null ? lastDragPosition : playbackPositionPx);
  
  const activeTimeText = isDragging 
    ? hoverTime 
    : (lastDragTime !== null ? lastDragTime : 
      `${Math.floor((localCurrentTime ?? 0) / 60)}:${Math.floor((localCurrentTime ?? 0) % 60)
          .toString()
          .padStart(2, "0")}`);

  return (
    <div
      className="relative w-full h-full cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <canvas ref={canvasRef} />
      <div
        ref={overlayRef}
        className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
      />
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
            className="absolute top-0 bottom-0 border-l border-black dark:border-white pointer-events-none"
            style={{
              left: `${activePosition}px`,
              opacity: hoverOpacity,
              transition: disableTransition
                ? "none"
                : "opacity 2s ease-in-out",
            }}
          />
          <div
            ref={textRef}
            className="absolute top-0 mt-1 text-black dark:text-white text-2xs pointer-events-none"
            style={{
              left: `${activePosition + 5}px`,
              opacity: hoverOpacity,
              transition: disableTransition
                ? "none"
                : "opacity 2s ease-in-out",
            }}
          >
            {activeTimeText}
          </div>

          {/* Fixed currentTime indicator */}
          <div
            ref={currentLineRef}
            className="absolute top-0 bottom-0 border-l border-white/50 pointer-events-none"
            style={{
              left: `${playbackPositionPx}px`,
              opacity: fixedOpacity,
              transition: disableTransition
                ? "none"
                : "opacity 2s ease-in-out",
            }}
          />
          <div
            ref={currentTextRef}
            className="absolute top-0 mt-1 text-white/50 text-2xs pointer-events-none"
            style={{
              left: `${playbackPositionPx + 5}px`,
              opacity: fixedOpacity,
              transition: disableTransition
                ? "none"
                : "opacity 2s ease-in-out",
            }}
          >
            {`${Math.floor((localCurrentTime ?? 0) / 60)}:${Math.floor(
              (localCurrentTime ?? 0) % 60
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