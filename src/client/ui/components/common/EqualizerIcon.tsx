// EqualizerIcon.tsx
import React, { useMemo } from "react";

interface BarConfig {
  maxScale: number; // Random maximum scale for the bar (when fully "up")
  duration: number; // Random animation duration
  delay: number; // Random animation delay
}

const EqualizerIcon: React.FC = () => {
  // Generate random configuration for 5 bars
  const barsData: BarConfig[] = useMemo(() => {
    return Array.from({ length: 5 }).map(() => {
      // Random maximum scale between 0.3 and 1.0
      const maxScale = Number((Math.random() * (1.0 - 0.6) + 0.3).toFixed(2));
      // Random duration between 0.8s and 1.5s
      const duration = Number((Math.random() * (0.5) + 0.2).toFixed(2));
      // Random delay between 0s and 0.5s
      const delay = Number((Math.random() * 0.5).toFixed(2));
      return { maxScale, duration, delay };
    });
  }, []);

  return (
    <div className="equalizer-container h-8">
      <div className="bars">
        {barsData.map((bar, index) => (
          <div
            key={index}
            className="bar"
            style={{
              animationDuration: `${bar.duration}s`,
              animationDelay: `${bar.delay}s`,
              // Pass the random maximum scale via a CSS variable.
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
          z-index: 0; /* Behind overlay icons */
          pointer-events: none;
        }
        .bars {
          display: flex;
          align-items: flex-end; /* Bars align at the bottom */
          gap: 2px; /* Adjust gap as needed */
          height: 100%; /* Take up parent's height */
        }
        .bar {
          width: 2px;
          height: 100%;
          background-color: #3B82F6; /* Tailwind's bg-blue-500 */
          transform-origin: bottom;
          animation-name: equalize;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate; /* Makes the animation reverse smoothly */
        }
        @keyframes equalize {
          0% {
            transform: scaleY(0.12);
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
