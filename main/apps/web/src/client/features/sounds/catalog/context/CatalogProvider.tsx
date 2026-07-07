// src/client/features/sounds/catalog/context/CatalogProvider.tsx

"use client";

import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Track } from '@/shared/types/track';
import { fetchTracks } from '@features/tracks/core/hooks';

// Define the context shape
interface CatalogContextType {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  filterTracks: (category?: string, searchTerm?: string) => void;
  filteredTracks: Track[];
}

// Create context with default values
const CatalogContext = createContext<CatalogContextType>({
  tracks: [],
  loading: false,
  error: null,
  filterTracks: () => {},
  filteredTracks: []
});

interface CatalogProviderProps {
  children?: ReactNode;
  tracks?: Track[];
}

// Provider component
const CatalogProvider: React.FC<CatalogProviderProps> = ({ children, tracks: initialTracks }) => {
  const hasInitial = initialTracks !== undefined && initialTracks.length > 0;
  const [fetchedTracks, setFetchedTracks] = useState<Track[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ category?: string; searchTerm?: string }>({});

  // Tracks come from props when provided; otherwise from the fetch below.
  const tracks = hasInitial ? initialTracks : fetchedTracks;
  const loading = hasInitial ? false : fetchLoading;

  // Fetch only when no tracks were passed in.
  useEffect(() => {
    if (hasInitial) return;
    fetchTracks().then(
      (data) => {
        setFetchedTracks(data);
        setError(null);
        setFetchLoading(false);
      },
      (err) => {
        setError('Failed to load tracks');
        console.error('Error loading tracks:', err);
        setFetchLoading(false);
      },
    );
  }, [hasInitial]);

  // Filtered view derived from the current tracks + filter criteria.
  const filteredTracks = useMemo(() => {
    const { category, searchTerm } = filter;
    let filtered = tracks;

    if (category && category !== 'all') {
      filtered = filtered.filter(track =>
        track.info.genre.some(g => g.maingenre === category || g.subgenre === category) ||
        track.info.mood.includes(category)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(track =>
        track.metadata.title.toLowerCase().includes(term) ||
        track.info.relatedartist.some(artist =>
          artist.toLowerCase().includes(term)
        )
      );
    }

    return filtered;
  }, [tracks, filter]);

  const filterTracks = (category?: string, searchTerm?: string) =>
    setFilter({ category, searchTerm });

  return (
    <CatalogContext.Provider 
      value={{ 
        tracks, 
        loading, 
        error, 
        filterTracks, 
        filteredTracks 
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export default CatalogProvider;