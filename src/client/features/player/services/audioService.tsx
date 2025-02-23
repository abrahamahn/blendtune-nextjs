// src\client\features\player\services\audioService.tsx
"use client";
import React, {
  useRef,
  ReactNode,
  createContext,
  RefObject,
} from "react";

interface AudioServiceType {
  audioRef: RefObject<HTMLAudioElement | null>;
}

interface AudioServiceProps {
  children: ReactNode;
}

// Create the AudioContext with a default value
export const AudioContext = createContext<AudioServiceType | undefined>(undefined);

const AudioService: React.FC<AudioServiceProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null!);

  return (
    <AudioContext.Provider value={{ audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioService;
