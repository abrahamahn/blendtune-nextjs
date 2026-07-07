// main/apps/web/src/client/components/player/PlayButton.tsx
// Round amber play/pause button — the one orchestrated moment of the interface.
import { Button } from '@ui';

import '../components.css';

import type { MouseEventHandler } from 'react';

export interface PlayButtonProps {
  /** Current playback state; determines icon and aria-label */
  playing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.5-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    </svg>
  );
}

export function PlayButton({
  playing = false,
  size = 'md',
  onClick,
  disabled,
  className,
}: PlayButtonProps) {
  return (
    <Button
      variant="primary"
      size="inline"
      className={`bt-play ${className ?? ''}`.trim()}
      data-size={size}
      aria-label={playing ? 'Pause' : 'Play'}
      onClick={onClick}
      disabled={disabled}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
}
