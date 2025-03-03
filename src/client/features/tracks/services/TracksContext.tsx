// src\client\features\tracks\services\TracksContext.tsx
"use client";

import React, { useState, ReactNode, useEffect, createContext, useContext, useCallback } from "react";
import { fetchTracks } from "@tracks/core/hooks";
import { Track } from "@/shared/types/track";
import { TrackServiceType } from "@tracks/types";
import { 
  TrackError, 
  TrackErrorCode, 
  isTrackError, 
  setErrorLogger 
} from "@tracks/utils/errors";

/**
 * Props type for the TracksProvider component.
 */
interface TracksProviderProps {
  children: ReactNode; // Represents child components wrapped within the provider
}

/**
 * Extended TrackServiceType that includes loading state, error information, and methods
 */
interface ExtendedTrackServiceType extends TrackServiceType {
  isLoading: boolean;
  error: { message: string; code: string } | null;
  // Add methods for track management
  setTrackList: (tracks: Track[]) => void;
  setCurrentTrack: (track: Track | undefined) => void;
}

/**
 * Initial state for the track service context.
 */
const initialTrackService: ExtendedTrackServiceType = {
  tracks: [],
  isLoading: false,
  error: null,
  setTrackList: () => {},
  setCurrentTrack: () => {}
};

/**
 * Context to provide track-related data throughout the application.
 */
export const TracksContext = createContext<ExtendedTrackServiceType>(initialTrackService);

// Optional: Configure a custom error logger
setErrorLogger({
  logError(error, context) {
    // Example: Send to a logging service or perform specific logging
    console.error('Tracks Error Logging:', {
      error: error.message,
      code: error instanceof TrackError ? error.code : 'UNKNOWN',
      context
    });
    
    // Potential integration with error tracking service
    // errorTrackingService.captureException(error, context);
  }
});

/**
 * TracksProvider component that fetches and manages track data
 * using local state and context instead of Redux.
 */
const TracksProvider: React.FC<TracksProviderProps> = ({ children }) => {
  // Local state for tracks
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrackState] = useState<Track | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; code: string } | null>(null);

  /**
   * Set track list method for consumers of this context
   */
  const setTrackList = useCallback((newTracks: Track[]) => {
    setTracks(newTracks);
  }, []);

  /**
   * Set current track method for consumers of this context
   */
  const setCurrentTrack = useCallback((track: Track | undefined) => {
    setCurrentTrackState(track);
  }, []);

  useEffect(() => {
    /**
     * Fetches track data from the API and updates context state
     */
    const fetchTrackData = async () => {
      // Reset state for new fetch operation
      setIsLoading(true);
      setError(null);
      
      try {
        const trackList = await fetchTracks();
        
        // Update local state
        setTracks(trackList);
        
        // Automatically set the first track as the current track if available
        if (trackList.length > 0 && !currentTrack) {
          setCurrentTrackState(trackList[0]);
        }
      } catch (err) {
        // Improved error handling
        let trackError: TrackError;

        if (isTrackError(err)) {
          // If it's already a TrackError, use it directly
          trackError = err;
        } else if (err instanceof Error) {
          // Convert standard Error to TrackError
          trackError = new TrackError(
            err.message, 
            TrackErrorCode.UNKNOWN_ERROR,
            { originalError: err }
          );
        } else {
          // Handle unknown error type
          trackError = new TrackError(
            'An unknown error occurred while fetching tracks', 
            TrackErrorCode.UNKNOWN_ERROR,
            { originalError: err }
          );
        }

        // Update state with error details
        setError({ 
          message: trackError.message, 
          code: trackError.code 
        });

        // The error will be automatically logged due to our enhanced TrackError
      } finally {
        // Always set loading to false when complete
        setIsLoading(false);
      }
    };

    fetchTrackData();
  }, [currentTrack]); // No need to include other dependencies as we're initializing

  // Construct the context value with all state and methods
  const contextValue: ExtendedTrackServiceType = {
    tracks,
    isLoading,
    error,
    setTrackList,
    setCurrentTrack
  };

  return (
    <TracksContext.Provider value={contextValue}>
      {children}
    </TracksContext.Provider>
  );
};

/**
 * Custom hook for accessing tracks context
 * Provides a convenient way to consume tracks state and methods
 * @throws {Error} If used outside of TracksProvider
 * @returns {ExtendedTrackServiceType} Tracks context with state and methods
 */
export const useTracks = (): ExtendedTrackServiceType => {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error('useTracks must be used within a TracksProvider');
  }
  return context;
};

export default TracksProvider;