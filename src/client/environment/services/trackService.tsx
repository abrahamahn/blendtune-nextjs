"use client";
import React, { useState, ReactNode, useEffect, createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTrack, setTrackList } from "@/client/environment/redux/slices/playback"; // 🔥 Import new action
import { getTracks } from "@/client/utils/data/getTracks";
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
  const dispatch = useDispatch();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const trackList = await getTracks();
        setTracks(trackList);
        dispatch(setTrackList(trackList)); // 🔥 Store the full track list in Redux
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

export const useTracks = () => {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error("useTracks must be used within a TracksProvider");
  }
  return context;
};
