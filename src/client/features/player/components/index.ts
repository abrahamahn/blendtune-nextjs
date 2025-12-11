// src\client\features\player\components\index.ts
/**
 * @fileoverview Export all player components with lazy loading for less critical components.
 * @module features/player/components
 */

import React, { lazy } from 'react';

export { default as MusicPlayer } from './MusicPlayer';
export { default as TrackInfo } from './TrackInfo';
export { default as PlayerControls } from './PlayerControls';
export { default as MobilePlayer } from './MobilePlayer';
export { default as ResizableHandle } from '../../layout/rightbar/context/ResizableHandle';

// Lazy load less critical components
export const VolumeControl = lazy(() => import('./VolumeControl'));
export const TrackProgress = lazy(() => import('./TrackProgress'));