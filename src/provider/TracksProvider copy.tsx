"use client";
import React, { useRef, useState, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTrack } from "@/redux/audioSlices/playback";
import { getTracks } from "@/lib/api/getTracks";
import TracksContext from "@/context/TracksContext";
import { Track } from "@/types/track";

interface AudioProviderProps {
  children: ReactNode;
}

const TracksProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [tracks, setTracks] = useState<Track[]>([]);
  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const trackList = await getTracks();
        setTracks(trackList);
        if (trackList.length > 0) {
          dispatch(setCurrentTrack(trackList[0]));
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTrackData();
  }, [dispatch]);
  return (
    <TracksContext.Provider value={{ tracks }}>
      {children}
    </TracksContext.Provider>
  );
};

export default TracksProvider;
