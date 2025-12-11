// src\client\shared\components\icons\PlayerIcons.tsx
/**
 * @fileoverview Centralized playback icons component
 * @module shared/components/common/PlayerIcons
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faPause, 
  faForwardStep, 
  faBackwardStep, 
  faRepeat 
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * Props for individual playback icon
 */
interface PlayerIconProps {
  /** FontAwesome icon definition */
  icon: IconDefinition;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional className for styling */
  className?: string;
  /** Icon size */
  size?: 'xs' | 'sm' | 'lg' | 'xl';
  /** Loop mode for repeat icon */
  loopMode?: 'off' | 'one' | 'all';
  /** Player state for play/pause icon */
  isPlaying?: boolean;
}

/**
 * Player icon component with customizable properties
 */
const PlayerIcon: React.FC<PlayerIconProps> = ({ 
  icon, 
  onClick, 
  className = "text-[#1F1F1F] dark:text-white cursor-pointer hover:opacity-75",
  size = 'lg',
  loopMode = 'off',
  isPlaying
}) => {
  // Special handling for repeat icon
  if (icon === faRepeat) {
    // Modify base className to include blue color logic
    const baseClassName = loopMode !== 'off' 
      ? "text-blue-500 dark:text-blue-500 cursor-pointer hover:opacity-75"
      : className;

    return (
      <div className="relative inline-block">
        <FontAwesomeIcon 
          icon={icon} 
          size={size} 
          className={baseClassName}
          onClick={onClick}
        />
        {loopMode !== 'off' && (
          <p className="absolute bottom-[-5px] right-[-5px] text-2xs text-blue-500">
            {loopMode === 'one' ? '1' : 'all'}
          </p>
        )}
      </div>
    );
  }

  // Special handling for play/pause icon
  if (icon === faPlay || icon === faPause) {
    const displayIcon = isPlaying ? faPause : faPlay;
    const playClassName = displayIcon === faPlay 
      ? `ml-0.5 ${className}` 
      : className;

    return (
      <FontAwesomeIcon 
        icon={displayIcon} 
        size={size} 
        className={playClassName}
        onClick={onClick}
      />
    );
  }

  // Standard playback icons
  return (
    <FontAwesomeIcon 
      icon={icon} 
      size={size} 
      className={className}
      onClick={onClick}
    />
  );
};

/**
 * Player icons with predefined configurations
 */
export const PlayerIcons = {
  /**
   * Play/Pause icon with dynamic state
   */
  PlayPause: (props: Omit<PlayerIconProps, 'icon'> & { isPlaying: boolean }) => (
    <PlayerIcon 
      icon={props.isPlaying ? faPause : faPlay}
      {...props}
      className={`${props.className || ''} ${props.isPlaying ? '' : 'ml-0.5'}`}
    />
  ),

  /**
   * Forward step icon with default styling
   */
  Forward: (props: Omit<PlayerIconProps, 'icon'> = {}) => (
    <PlayerIcon icon={faForwardStep} {...props} />
  ),

  /**
   * Backward step icon with default styling
   */
  Backward: (props: Omit<PlayerIconProps, 'icon'> = {}) => (
    <PlayerIcon icon={faBackwardStep} {...props} />
  ),

  /**
   * Repeat icon with loop mode support
   */
  Repeat: (props: Omit<PlayerIconProps, 'icon'> & { loopMode?: 'off' | 'one' | 'all' } = {}) => (
    <PlayerIcon 
      icon={faRepeat} 
      size="sm" 
      {...props} 
    />
  )
};

export default PlayerIcon;