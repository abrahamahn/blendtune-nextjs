import React, { useEffect, useRef, useState, RefObject } from "react";

interface WaveformProps {
  audioUrl: string;
  audioRef: RefObject<HTMLAudioElement>;
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
  const overlayRef = useRef<HTMLDivElement | null>(null); // Ref for the hoverable overlay
  const lineRef = useRef<HTMLDivElement | null>(null); // Ref for the cursor position line
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [hoverTime, setHoverTime] = useState<string>("");
  const [hoverPosition, setHoverPosition] = useState<number>(0); // Y-axis position of the hovered line
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Constants for bar and gap width
  const barWidth = 2;
  const gapWidth = 1;

  // Calculate number of bars based on passed width
  const numBars = Math.floor((width + gapWidth) / (barWidth + gapWidth));

  useEffect(() => {
    const fetchDataAndDecode = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        let AudioContextClass: typeof AudioContext;
        if (window.AudioContext) {
          AudioContextClass = window.AudioContext;
        } else if ((window as any).webkitAudioContext) {
          // Type assertion here
          AudioContextClass = (window as any).webkitAudioContext;
        } else {
          throw new Error("Web Audio API is not supported in this browser");
        }

        const audioContext = new AudioContextClass();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        setAudioBuffer(buffer);
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    fetchDataAndDecode();
  }, [audioUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !audioBuffer) return;

    // Adjust canvas size to fit its width
    canvas.width = width;
    canvas.height = 50; // Fixed height

    const drawBars = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const data = audioBuffer.getChannelData(0);
      const sampleSize = Math.floor(data.length / numBars);

      for (let i = 0; i < numBars; i++) {
        let sumSquared = 0;
        for (let j = 0; j < sampleSize; j++) {
          const amplitude = data[i * sampleSize + j];
          sumSquared += amplitude * amplitude;
        }
        const rms = Math.sqrt(sumSquared / sampleSize);
        const baseBarHeight = rms * amplitude * canvas.height * 6;
        const offsetY = (canvas.height - baseBarHeight) / 2;

        // Compare the position of the current bar with the current time
        const barPosition = i * (barWidth + gapWidth);
        const barEndTime = trackDuration
          ? ((barPosition + barWidth) * trackDuration) /
            (numBars * (barWidth + gapWidth))
          : 0;
        const passed = barEndTime < currentTime!;

        context.fillStyle = passed ? "#2563EB" : "#848484";

        context.fillRect(barPosition, offsetY, barWidth, baseBarHeight);
      }

      // Calculate progress percentage based on currentTime and trackDuration
      const percentage = (currentTime! / (trackDuration || 1)) * 100;
      setProgressPercentage(percentage);
    };

    drawBars();
  }, [width, audioBuffer, amplitude, currentTime, trackDuration, numBars]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const overlay = overlayRef.current;
    const line = lineRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !line || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    // Check if the mouse pointer is within the container div
    if (
      offsetX >= 0 &&
      offsetX <= rect.width &&
      offsetY >= 0 &&
      offsetY <= rect.height
    ) {
      // Calculate percentage and time based on the cursor position
      const percentage = (offsetX / rect.width) * 100;
      const timeInSeconds = (trackDuration || 0) * (percentage / 100);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const hoverTimeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      // Update position and time indication
      setHoverPosition(offsetX);
      setHoverTime(hoverTimeString);

      line.style.left = `${offsetX}px`;
      line.style.visibility = "visible";
      line.style.opacity = "1";

      if (event.type === "click") {
        const newTime = timeInSeconds;
        updateCurrentTime(newTime);

        if (audioRef.current) {
          audioRef.current.currentTime = newTime;
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
      ></div>
      {/* New line div for indicating current time */}
      {audioBuffer && currentTime !== undefined && (
        <div
          className="absolute top-0 bottom-0 border-l border-white pointer-events-none"
          style={{
            left: `${(currentTime / (trackDuration || 1)) * 100}%`,
          }}
        ></div>
      )}

      {isHovering && (
        <>
          <div
            ref={lineRef}
            className="absolute top-0 bottom-0 border-l border-black dark:border-white pointer-events-none transition-opacity duration-300"
            style={{ left: `${hoverPosition}px`, opacity: 0 }}
          ></div>
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
