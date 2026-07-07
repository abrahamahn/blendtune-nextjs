// main/apps/web/src/client/features/player/components/VolumeControl.tsx
/**
 * Volume button + vertical slider popover. Uses a throttled mouse-move handler
 * (~60fps) to limit DOM measurements while dragging.
 */
import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from '@ui';
import { useVolumeControl } from '../hooks';
import { useThrottleFn } from '@client/shared/utils/useThrottleFn';

import './player.css';

const VolumeControl: React.FC = () => {
  const {
    volume,
    setVolume,
    volumeIcon,
    iconTransform,
    toggleVolumeVisibility,
    isVolumeVisible,
    calculateVolume,
  } = useVolumeControl();

  const volumeBarRef = useRef<HTMLDivElement>(null);

  const handleVolumeMouseMove = useThrottleFn(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (volumeBarRef.current) {
        const rect = volumeBarRef.current.getBoundingClientRect();
        setVolume(calculateVolume(e.clientY, rect));
      }
    },
    16,
  );

  return (
    <div className="bt-player-volume">
      <Button
        variant="text"
        size="inline"
        className="bt-player-icon-btn"
        onClick={toggleVolumeVisibility}
        aria-label="Volume"
        aria-expanded={isVolumeVisible}
      >
        <FontAwesomeIcon icon={volumeIcon} size="sm" style={{ transform: iconTransform }} />
      </Button>
      {isVolumeVisible && (
        <div
          className="bt-volume-pop"
          onMouseMove={handleVolumeMouseMove}
          onWheel={(e) => e.preventDefault()}
        >
          <div ref={volumeBarRef} className="bt-volume-bar">
            <div className="bt-volume-rest" style={{ height: `${(1 - volume) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
