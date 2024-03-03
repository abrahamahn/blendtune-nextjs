import React, { createContext, RefObject } from 'react';
import { Track } from "@/types/track";

export interface TracksContextType {
  tracks: Track[]; 
}

const initialTracksContext: TracksContextType = {
  tracks: [],
};

const TracksContext = createContext<TracksContextType>(initialTracksContext);

export default TracksContext;