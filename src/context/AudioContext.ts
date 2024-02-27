import React, { createContext, RefObject } from 'react';

export interface AudioContextType {
  audioRef: RefObject<HTMLAudioElement>;
}

const initialAudioContext: AudioContextType = {
  audioRef: null!,
};

const AudioContext = createContext<AudioContextType>(initialAudioContext);

export default AudioContext;
