// src\client\features\player\store\playbackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Track {
  id: number;
  file: string;
  metadata: {
    catalog: string;
    isrc: string;
    iswc: string;
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
      note: string;
      scale: string;
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
    time: string;
    section: string;
  }[];
  instruments: {
    main: string;
    sub: string;
  }[];
  sample: {
    file: string;
    samplepack: string;
    author: string;
    clearance: string;
  };
  creator: {
    name: string;
    producer: boolean;
    songwriter: boolean;
    ipi: string;
    splits: string;
  }[];
  exclusive: {
    artistname: string;
    email: string;
    phone: string;
    address: string;
    management: string;
  };
}

interface PlaybackState {
  currentTrack: Track | undefined;
  isPlaying: boolean;
  trackList: Track[];
  loopedTrackList: Track[];
  loopMode: "off" | "one" | "all";
  isVolumeVisible: boolean;
  currentTime: number;
  trackDuration: number;
}

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

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track | undefined>) => {
      state.currentTrack = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setTrackList: (state, action: PayloadAction<Track[]>) => {
      state.trackList = action.payload;
    },
    setLoopedTrackList: (state, action: PayloadAction<Track[]>) => {
      state.loopedTrackList = action.payload;
    },
    setLoopMode: (state, action: PayloadAction<"off" | "one" | "all">) => {
      state.loopMode = action.payload;
    },
    setIsVolumeVisible: (state, action: PayloadAction<boolean>) => {
      state.isVolumeVisible = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setTrackDuration: (state, action: PayloadAction<number>) => {
      state.trackDuration = action.payload;
    },
  },
});

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
