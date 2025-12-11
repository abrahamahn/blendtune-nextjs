// src/client/features/sounds/catalog/index.ts

// Import components
import TrackCard from './components/TrackCard';
import TrackCardItem from './components/TrackCardItem';
import MobileCatalog from './layouts/MobileCatalog';
import DesktopCatalog from './layouts/DesktopCatalog';
import NewTracks from './layouts/NewTracks';

// Import the provider
import CatalogProvider, { useCatalog } from './context/CatalogProvider';

// Export components
export {
  TrackCard,
  TrackCardItem,
  MobileCatalog,
  DesktopCatalog,
  NewTracks,
  CatalogProvider,
  useCatalog
};