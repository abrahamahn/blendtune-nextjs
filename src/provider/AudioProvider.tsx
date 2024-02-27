"use client";
import React, { useRef, ReactNode } from "react";
import AudioContext from "@/context/AudioContext";

interface AudioProviderProps {
  children: ReactNode;
}

const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null!);

  return (
    <AudioContext.Provider value={{ audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
