// src\client\features\player\hooks\useAudio.ts
"use client";
import { useContext, RefObject } from "react";
import { AudioContext } from "@player/services";

export interface AudioContextValue {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export default useAudio;