// src\client\features\sounds\tracks\services\trackService.tsx
"use client";
import React, { useState, ReactNode, useEffect, createContext } from "react";
import { useAppDispatch } from "@store/hooks/useAppDispatch";
import { setCurrentTrack, setTrackList } from "@store/slices";
import { fetchTracks } from "@tracks/hooks";
import { Track } from "@/shared/types/track";

interface TracksProviderProps {
  children: ReactNode;
}

export interface TrackServiceType {
  tracks: Track[];
}

const initialTrackService: TrackServiceType = {
  tracks: [],
};

export const TracksContext = createContext<TrackServiceType>(initialTrackService);

const TracksProvider: React.FC<TracksProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch(); // Use typed dispatch
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const trackList = await fetchTracks();
        setTracks(trackList);
        dispatch(setTrackList(trackList)); // Store the full track list in Redux
        if (trackList.length > 0) {
          dispatch(setCurrentTrack(trackList[0]));
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTrackData();
  }, [dispatch]);

  return <TracksContext.Provider value={{ tracks }}>{children}</TracksContext.Provider>;
};

export default TracksProvider;

