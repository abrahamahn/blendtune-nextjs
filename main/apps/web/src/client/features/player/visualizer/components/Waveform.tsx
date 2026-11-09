// main/apps/web/src/client/features/player/visualizer/components/Waveform.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  drawWaveformBars,
  useWaveformBuffer,
} from "../utils/waveformRenderer";
import { formatTime } from "../../utils/formatTime";

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
  const currentLineRef = useRef<HTMLDivElement | null>(null);
  const currentTextRef = useRef<HTMLDivElement | null>(null);

  const fadeDelayTimeoutRef = useRef<number | null>(null);
  const fadeHideTimeoutRef = useRef<number | null>(null);

  const audioBuffer = useWaveformBuffer(audioUrl);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [hoverTimeVisible, setHoverTimeVisible] = useState(false);
  const [hoverOpacity, setHoverOpacity] = useState(1);
  const [fixedOpacity, setFixedOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);
  const [lastDragPosition, setLastDragPosition] = useState<number | null>(null);
  const [lastDragTime, setLastDragTime] = useState<string | null>(null);

  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [prevPropTime, setPrevPropTime] = useState(currentTime);
  if (currentTime !== prevPropTime) {
    setPrevPropTime(currentTime);
    setSeekTime(null);
  }
  const localCurrentTime = seekTime ?? currentTime;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;
    drawWaveformBars(canvas, audioBuffer, {
      width,
      amplitude,
      time: localCurrentTime,
      trackDuration,
      isDragging,
      hoverPosition,
    });
  }, [
    audioBuffer,
    width,
    amplitude,
    localCurrentTime,
    trackDuration,
    isDragging,
    hoverPosition,
  ]);

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

  const handleMouseMove = useCallback(
    (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current || !trackDuration) return;
      const rect = canvasRef.current.getBoundingClientRect();
      let offsetX = event.clientX - rect.left;
      offsetX = Math.max(0, Math.min(offsetX, rect.width));
      setHoverPosition(offsetX);

      const percentage = offsetX / rect.width;
      const newTime = trackDuration * percentage;
      setHoverTime(formatTime(newTime));

      if (lineRef.current) {
        lineRef.current.style.left = `${offsetX}px`;
      }
      if (textRef.current) {
        textRef.current.style.left = `${offsetX + 5}px`;
      }
    },
    [trackDuration],
  );

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    cancelPendingFade();
    setIsDragging(true);
    setHoverTimeVisible(true);
    setDisableTransition(true);
    setHoverOpacity(1);
    setFixedOpacity(1);
    handleMouseMove(event);
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !canvasRef.current || !trackDuration) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const percentage = hoverPosition / rect.width;
    const finalTime = trackDuration * percentage;

    setLastDragPosition(hoverPosition);
    setLastDragTime(hoverTime);
    setSeekTime(finalTime);
    updateCurrentTime(finalTime);
    setIsDragging(false);

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
        setHoverOpacity(1);
        setFixedOpacity(1);
      }, 2000);
    }, 2000);
  }, [isDragging, hoverPosition, hoverTime, trackDuration, updateCurrentTime]);

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

  const playbackPositionPx =
    ((localCurrentTime ?? 0) / (trackDuration || 1)) * width;

  const activePosition = isDragging
    ? hoverPosition
    : lastDragPosition !== null
      ? lastDragPosition
      : playbackPositionPx;

  const formattedCurrentTime = formatTime(localCurrentTime ?? 0);
  const activeTimeText = isDragging
    ? hoverTime
    : lastDragTime !== null
      ? lastDragTime
      : formattedCurrentTime;

  return (
    <div className="bt-wave" onMouseDown={handleMouseDown}>
      <canvas ref={canvasRef} />
      <div ref={overlayRef} className="bt-wave-overlay" />
      {hoverTimeVisible && (
        <>
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
            {formattedCurrentTime}
          </div>
        </>
      )}
    </div>
  );
};

export default Waveform;
