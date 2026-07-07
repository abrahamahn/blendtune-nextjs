// main/apps/web/src/pages/SoundsPage.tsx
import React, { useEffect } from 'react';

import Header from '@client/features/layout/header';
import LeftBar from '@layout/leftbar';
import { RightSidebarProvider, useRightSidebar } from '@rightbar/context/useRightSidebar';
import RightBar from '@layout/rightbar';
import StoreProvider from '@providers/StoreProvider';

import { usePlayer } from '@client/features/player/services/playerService';
import { useTracks } from '@client/features/tracks';
import { Hero } from '@sounds/hero';
import { Category } from '@sounds/category/layout';
import { NewTracks } from '@sounds/catalog/layouts';
import { CatalogProvider } from '@sounds/catalog';
import { MobileFilter, DesktopFilter } from '@sounds/filters/layout';
import { useFilterContext } from '@sounds/filters/context';
import { MobileCatalog, DesktopCatalog } from '@sounds/catalog';
import { Track } from '@shared/types/track';

/**
 * RightSidebarWrapper Component:
 * - Renders the right sidebar only when it is open.
 */
const RightSidebarWrapper: React.FC = () => {
  const { isOpen } = useRightSidebar();
  return isOpen ? <RightBar /> : null;
};

/**
 * SoundsLayout Component:
 * - Provides a structured layout with a header, left sidebar, right sidebar, and content area.
 * - Uses global state providers to manage sidebar visibility.
 */
const SoundsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StoreProvider>
    <RightSidebarProvider>
      <div className="flex flex-col h-full overflow-y-scroll">
        {/* HEADER */}
        <div className="h-14 shrink-0">
          <Header />
        </div>

        {/* MAIN CONTAINER */}
        <div className="flex-auto overflow-hidden">
          <div className="flex h-full">
            {/* LEFT SIDEBAR (Visible on md+ screen sizes) */}
            <div className="hidden md:block w-20 flex-none relative h-full overflow-auto">
              <div className="absolute top-2 left-2 right-1 bottom-2 overflow-auto">
                <LeftBar />
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="p-0 m-0 flex-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0">
                <div className="absolute top-2 left-1 right-1 bottom-2 rounded-xl overflow-auto bg-white border dark:border-0 dark:bg-neutral-950">
                  {children}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR (Renders conditionally) */}
            <RightSidebarWrapper />
          </div>
        </div>
      </div>
    </RightSidebarProvider>
  </StoreProvider>
);

/**
 * Sounds Component:
 * - Manages audio playback and track selection
 * - Handles UI interactions for track browsing and playing
 */
const Sounds: React.FC = () => {
  // Access player context and methods
  const { setTrackList, playTrack } = usePlayer();

  // Track and filter contexts
  const { isLoading } = useTracks();
  const { filteredTracks } = useFilterContext();

  // Update track list when filtered tracks change
  useEffect(() => {
    if (filteredTracks.length > 0) {
      setTrackList(filteredTracks);
    }
  }, [filteredTracks, setTrackList]);

  // Handler for playing tracks
  const handlePlayTrack = (track: Track) => {
    playTrack(track);
  };

  // Handler for track title clicks
  const handleTitleClick = (track: Track) => {
    // Implement title click behavior if needed
    console.log('Track title clicked:', track.metadata.title);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="md:h-full overflow-y-scroll rounded-t-xl">
        {/* Mobile filter */}
        <MobileFilter />

        {/* Hero section with playback controls */}
        <div>
          <Hero />
        </div>

        {/* Category selector */}
        <div>
          <Category isLoading={isLoading} />
        </div>

        {/* New tracks display */}
        <div>
          <NewTracks />
        </div>

        {/* Desktop filter */}
        <DesktopFilter />

        {/* Catalog with actual children components */}
        <CatalogProvider tracks={filteredTracks}>
          <div>
            {/* Mobile catalog view */}
            <MobileCatalog
              tracks={filteredTracks}
              playTrack={handlePlayTrack}
              onTitleClick={handleTitleClick}
              isLoading={isLoading}
            />

            {/* Desktop catalog view */}
            <DesktopCatalog
              tracks={filteredTracks}
              playTrack={handlePlayTrack}
              onTitleClick={handleTitleClick}
              isLoading={isLoading}
            />
          </div>
        </CatalogProvider>
      </div>
    </div>
  );
};

/** /sounds — the catalog browsing page, wrapped in its own header/sidebar layout. */
export const SoundsPage: React.FC = () => (
  <SoundsLayout>
    <Sounds />
  </SoundsLayout>
);
