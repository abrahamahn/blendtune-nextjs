// src\client\shared\components\common\EqualizerIcon.tsx
import React, { useEffect, useMemo, useState } from "react";

/** Configuration for individual equalizer bar */
interface BarConfig {
  /** Maximum scale for bar animation */
  maxScale: number;
  /** Animation duration */
  duration: number;
  /** Animation delay */
  delay: number;
}

/** Props for Equalizer component */
interface EqualizerIconProps {
  /** Indicates if audio is currently playing */
  isPlaying: boolean;
}

/**
 * Animated equalizer icon with randomized bar movements
 */
const EqualizerIcon: React.FC<EqualizerIconProps> = ({ isPlaying }) => {
  // Manages animation state
  const [animationActive, setAnimationActive] = useState(false);

  // Handles animation based on play state
  useEffect(() => {
    if (isPlaying) {
      const timeout = setTimeout(() => setAnimationActive(true), 100);
      return () => clearTimeout(timeout);
    } else {
      setAnimationActive(false);
    }
  }, [isPlaying]);

  // Generates random bar configurations
  const barsData: BarConfig[] = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      maxScale: Number((Math.random() * (1.0 - 0.6) + 0.3).toFixed(2)),
      duration: Number((Math.random() * (0.5) + 0.2).toFixed(2)),
      delay: Number((Math.random() * 0.5).toFixed(2)),
    }));
  }, []);

  return (
    <div className="equalizer-container h-8">
      <div className="bars">
        {barsData.map((bar, index) => (
          <div
            key={index}
            className={`bar ${animationActive ? "animate" : "paused"}`}
            style={{
              animationDuration: animationActive ? `${bar.duration}s` : "0s",
              animationDelay: animationActive ? `${bar.delay}s` : "0s",
              "--max-scale": bar.maxScale,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <style jsx>{`
        .equalizer-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
          pointer-events: none;
        }
        .bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 100%;
        }
        .bar {
          width: 2px;
          height: 100%;
          background-color: #3B82F6;
          transform-origin: bottom;
          transform: scaleY(0);
          opacity: 0;
        }
        .bar.animate {
          opacity: 1;
          animation-name: equalize;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        .bar.paused {
          opacity: 1;
          transform: scaleY(0.10);
        }
        @keyframes equalize {
          0% {
            transform: scaleY(0.06);
          }
          50% {
            transform: scaleY(calc(var(--max-scale, 1) * 0.5));
          }
          100% {
            transform: scaleY(var(--max-scale, 0.6));
          }
        }
      `}</style>
    </div>
  );
};

export default EqualizerIcon;