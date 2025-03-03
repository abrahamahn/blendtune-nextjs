// src/client/features/sounds/catalog/context/CatalogProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Track } from '@/shared/types/track';
import { fetchTracks } from '@tracks/core/hooks';

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

// Hook to use the catalog context
export const useCatalog = () => useContext(CatalogContext);

interface CatalogProviderProps {
  children?: ReactNode;
  tracks?: Track[];
}

// Provider component
export const CatalogProvider: React.FC<CatalogProviderProps> = ({ children, tracks: initialTracks }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);

  // Load tracks when component mounts or when initialTracks changes
  useEffect(() => {
    // If tracks are provided as props, use them
    if (initialTracks && initialTracks.length > 0) {
      setTracks(initialTracks);
      setFilteredTracks(initialTracks);
      setLoading(false);
      return;
    }

    // Otherwise fetch tracks
    const loadTracks = async () => {
      try {
        setLoading(true);
        const data = await fetchTracks();
        setTracks(data);
        setFilteredTracks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tracks');
        console.error('Error loading tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, [initialTracks]);

  // Function to filter tracks based on category and search term
  const filterTracks = (category?: string, searchTerm?: string) => {
    let filtered = [...tracks];

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

    setFilteredTracks(filtered);
  };

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