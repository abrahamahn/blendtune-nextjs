// main/apps/web/src/client/features/layout/rightbar/index.tsx
'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@ui';
import { useNowPlaying } from './context/useNowPlaying';
import NowPlaying from './components/NowPlaying';
import Queue from './components/Queue';

import './rightbar.css';

/** Right now-playing sidebar (desktop): full player + up-next queue. */
const RightBar: React.FC = () => {
  const { isOpen, close } = useNowPlaying();
  if (!isOpen) return null;

  return (
    <aside className="bt-rightbar" aria-label="Now playing">
      <header className="bt-rightbar-head">
        <span className="bt-rightbar-eyebrow">Now playing</span>
        <Button
          variant="text"
          size="inline"
          className="bt-np-icon"
          onClick={close}
          aria-label="Close now playing"
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </header>
      <div className="bt-rightbar-scroll">
        <NowPlaying />
        <Queue />
      </div>
    </aside>
  );
};

export default RightBar;
export { NowPlayingProvider, useNowPlaying } from './context/useNowPlaying';
