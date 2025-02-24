// src\client\features\player\store\playbackSlice.ts
/**
* @fileoverview Redux slice for managing audio playback state
* @module player/store/playbackSlice
*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
* Track metadata and information interface
*/
interface Track {
 id: number;
 file: string;
 metadata: {
   catalog: string;
   isrc: string;      // International Standard Recording Code
   iswc: string;      // International Standard Musical Work Code
   title: string;
   release: string;
   album: string;
   track: string;
   producer: string;
 };
 info: {
   duration: string;
   bpm: string;
   key: {
     note: string;    // Musical note (e.g., C, D#)
     scale: string;   // Scale type (e.g., major, minor)
   };
   genre: {
     maingenre: string;
     subgenre: string;
   }[];
   relatedartist: string[];
   mood: string[];
   tag: string[];
 };
 arrangement: {
   time: string;      // Timestamp
   section: string;   // Song section name
 }[];
 instruments: {
   main: string;      // Primary instrument
   sub: string;       // Secondary instrument
 }[];
 sample: {
   file: string;
   samplepack: string;
   author: string;
   clearance: string; // Sample clearance status
 };
 creator: {
   name: string;
   producer: boolean;
   songwriter: boolean;
   ipi: string;      // Interested Parties Information
   splits: string;   // Revenue sharing percentage
 }[];
 exclusive: {
   artistname: string;
   email: string;
   phone: string;
   address: string;
   management: string;
 };
}

/**
* Playback state interface
*/
interface PlaybackState {
 currentTrack: Track | undefined;
 isPlaying: boolean;
 trackList: Track[];          // Main playlist
 loopedTrackList: Track[];    // Tracks for loop mode
 loopMode: "off" | "one" | "all";
 isVolumeVisible: boolean;
 currentTime: number;         // Current playback position
 trackDuration: number;       // Total track duration
}

/**
* Initial playback state
*/
const initialState: PlaybackState = {
 currentTrack: undefined,
 isPlaying: false,
 trackList: [],
 loopedTrackList: [],
 loopMode: "all",
 isVolumeVisible: false,
 currentTime: 0,
 trackDuration: 0,
};

/**
* Playback reducer with state mutations
*/
const playbackSlice = createSlice({
 name: "playback",
 initialState,
 reducers: {
   // Set current playing track
   setCurrentTrack: (state, action: PayloadAction<Track | undefined>) => {
     state.currentTrack = action.payload;
   },
   // Update playing state
   setIsPlaying: (state, action: PayloadAction<boolean>) => {
     state.isPlaying = action.payload;
   },
   // Update main track list
   setTrackList: (state, action: PayloadAction<Track[]>) => {
     state.trackList = action.payload;
   },
   // Update loop track list
   setLoopedTrackList: (state, action: PayloadAction<Track[]>) => {
     state.loopedTrackList = action.payload;
   },
   // Set loop mode (off/one/all)
   setLoopMode: (state, action: PayloadAction<"off" | "one" | "all">) => {
     state.loopMode = action.payload;
   },
   // Toggle volume control visibility
   setIsVolumeVisible: (state, action: PayloadAction<boolean>) => {
     state.isVolumeVisible = action.payload;
   },
   // Update current playback time
   setCurrentTime: (state, action: PayloadAction<number>) => {
     state.currentTime = action.payload;
   },
   // Set total track duration
   setTrackDuration: (state, action: PayloadAction<number>) => {
     state.trackDuration = action.payload;
   },
 },
});

// Export actions
export const {
 setCurrentTrack,
 setIsPlaying,
 setTrackList,
 setLoopedTrackList,
 setLoopMode,
 setIsVolumeVisible,
 setCurrentTime,
 setTrackDuration,
} = playbackSlice.actions;

export default playbackSlice.reducer;