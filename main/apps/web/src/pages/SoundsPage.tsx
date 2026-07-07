// main/apps/web/src/pages/SoundsPage.tsx
import React, { useEffect } from 'react';

import Header from '@client/features/layout/header';
import LeftBar from '@features/layout/leftbar';
import StoreProvider from '@core/providers/StoreProvider';

import { usePlayer } from '@client/features/player/services/playerService';
import { useTracks } from '@client/features/tracks';
import { Hero } from '@features/sounds/hero';
import { Category } from '@features/sounds/category/layout';
import { CatalogProvider, Catalog, NewTracks } from '@features/sounds/catalog';
import { MobileFilter, DesktopFilter } from '@features/sounds/filters/layout';
import { useFilterContext } from '@features/sounds/filters/context';

import './SoundsPage.css';

/**
 * Three-zone marketplace shell per the design direction: left nav rail,
 * full-width content, and the persistent bottom player (owned by the app shell).
 * The former right details sidebar is gone — its content lives in the player's
 * expanded state.
 */
const SoundsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StoreProvider>
    <div className="bt-sounds">
      <div className="bt-sounds-header">
        <Header />
      </div>
      <div className="bt-sounds-body">
        <aside className="bt-sounds-rail">
          <LeftBar />
        </aside>
        <div className="bt-sounds-content">{children}</div>
      </div>
    </div>
  </StoreProvider>
);

/**
 * /sounds content: hero, genre tabs, new-tracks carousel, filters, and the
 * catalog list. Keeps the player's track list in sync with the active filters.
 */
const Sounds: React.FC = () => {
  const { setTrackList } = usePlayer();
  const { isLoading } = useTracks();
  const { filteredTracks } = useFilterContext();

  // Update track list when filtered tracks change
  useEffect(() => {
    if (filteredTracks.length > 0) {
      setTrackList(filteredTracks);
    }
  }, [filteredTracks, setTrackList]);

  return (
    <div className="bt-sounds-sections">
      <MobileFilter />
      <Hero />
      <Category isLoading={isLoading} />
      <NewTracks />
      <DesktopFilter />
      <CatalogProvider tracks={filteredTracks}>
        <Catalog tracks={filteredTracks} isLoading={isLoading} />
      </CatalogProvider>
    </div>
  );
};

/** /sounds — the catalog browsing page, wrapped in its own header/rail layout. */
export const SoundsPage: React.FC = () => (
  <SoundsLayout>
    <Sounds />
  </SoundsLayout>
);
