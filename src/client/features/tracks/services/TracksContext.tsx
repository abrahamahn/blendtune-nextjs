// src\client\features\tracks\services\TracksContext.tsx
"use client";

import React, { useState, ReactNode, useEffect, createContext } from "react";
import { useAppDispatch } from "@store/hooks/useAppDispatch";
import { setCurrentTrack, setTrackList } from "@store/slices";
import { fetchTracks } from "@tracks/core/hooks";
import { Track } from "@/shared/types/track";
import { TrackServiceType } from "@tracks/types";
import { 
  TrackError, 
  TrackErrorCode, 
  isTrackError, 
  createFetchError,
  setErrorLogger 
} from "@tracks/utils/errors";

/**
 * Props type for the TracksProvider component.
 */
interface TracksProviderProps {
  children: ReactNode; // Represents child components wrapped within the provider
}

/**
 * Extended TrackServiceType that includes loading state and error information
 */
interface ExtendedTrackServiceType extends TrackServiceType {
  isLoading: boolean;
  error: { message: string; code: string } | null;
}

/**
 * Initial state for the track service context.
 */
const initialTrackService: ExtendedTrackServiceType = {
  tracks: [],
  isLoading: false,
  error: null
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
 * TracksProvider component that fetches and manages track data,
 * storing it in both local state and Redux.
 */
const TracksProvider: React.FC<TracksProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch(); // Typed Redux dispatch function
  const [tracks, setTracks] = useState<Track[]>([]); // Local state for tracks
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; code: string } | null>(null);

  useEffect(() => {
    /**
     * Fetches track data from the API and updates both local state and Redux store.
     */
    const fetchTrackData = async () => {
      // Reset state for new fetch operation
      setIsLoading(true);
      setError(null);
      
      try {
        const trackList = await fetchTracks();
        
        // Update local state
        setTracks(trackList);
        
        // Store the full track list in Redux
        dispatch(setTrackList(trackList));
        
        // Automatically set the first track as the current track if available
        if (trackList.length > 0) {
          dispatch(setCurrentTrack(trackList[0]));
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
  }, [dispatch]); // Ensure dispatch is included as a dependency

  // Construct the context value with all state
  const contextValue = {
    tracks,
    isLoading,
    error
  };

  return (
    <TracksContext.Provider value={contextValue}>
      {children}
    </TracksContext.Provider>
  );
};

export default TracksProvider;