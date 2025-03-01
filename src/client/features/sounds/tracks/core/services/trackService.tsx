// src\client\features\sounds\tracks\services\trackService.tsx

"use client";

import React, { useState, ReactNode, useEffect, createContext } from "react";
import { useAppDispatch } from "@store/hooks/useAppDispatch";
import { setCurrentTrack, setTrackList } from "@store/slices";
import { fetchTracks } from "@/client/features/sounds/tracks/core/hooks";
import { Track } from "@/shared/types/track";

/**
 * Props type for the TracksProvider component.
 */
interface TracksProviderProps {
  children: ReactNode; // Represents child components wrapped within the provider
}

/**
 * Defines the structure of the TrackService context.
 */
export interface TrackServiceType {
  tracks: Track[]; // List of available tracks
}

/**
 * Initial state for the track service context.
 */
const initialTrackService: TrackServiceType = {
  tracks: [],
};

/**
 * Context to provide track-related data throughout the application.
 */
export const TracksContext = createContext<TrackServiceType>(initialTrackService);

/**
 * TracksProvider component that fetches and manages track data,
 * storing it in both local state and Redux.
 */
const TracksProvider: React.FC<TracksProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch(); // Typed Redux dispatch function
  const [tracks, setTracks] = useState<Track[]>([]); // Local state for tracks

  useEffect(() => {
    /**
     * Fetches track data from the API and updates both local state and Redux store.
     */
    const fetchTrackData = async () => {
      try {
        const trackList = await fetchTracks();
        setTracks(trackList); // Update local state
        dispatch(setTrackList(trackList)); // Store the full track list in Redux
        
        // Automatically set the first track as the current track if available
        if (trackList.length > 0) {
          dispatch(setCurrentTrack(trackList[0]));
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTrackData();
  }, [dispatch]); // Ensure dispatch is included as a dependency

  return (
    <TracksContext.Provider value={{ tracks }}>
      {children}
    </TracksContext.Provider>
  );
};

export default TracksProvider;
