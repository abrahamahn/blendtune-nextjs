// main/apps/web/src/client/features/layout/rightbar/context/useNowPlaying.tsx
'use client';

import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface NowPlayingContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const NowPlayingContext = createContext<NowPlayingContextValue | null>(null);

/** Default the right now-playing panel open on desktop, closed on narrow screens. */
const defaultOpen = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 64rem)').matches;

export const NowPlayingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const value = useMemo<NowPlayingContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [isOpen],
  );

  return <NowPlayingContext.Provider value={value}>{children}</NowPlayingContext.Provider>;
};

export const useNowPlaying = (): NowPlayingContextValue => {
  const ctx = useContext(NowPlayingContext);
  if (!ctx) throw new Error('useNowPlaying must be used within a NowPlayingProvider');
  return ctx;
};
