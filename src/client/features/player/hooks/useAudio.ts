// src\client\features\player\hooks\useAudio.ts
/**
* @fileoverview Custom hook for accessing shared audio player context
* @module player/hooks/useAudio
*/

"use client";
import { useContext, RefObject } from "react";
import { AudioContext } from "@player/services";

/**
* Audio context value interface
* @interface AudioContextValue
* @property {RefObject<HTMLAudioElement | null>} audioRef - Reference to HTML audio element
*/
export interface AudioContextValue {
 audioRef: RefObject<HTMLAudioElement | null>;
}

/**
* Hook to access audio player functionality
* Provides access to shared audio context and player controls
* 
* @throws {Error} If used outside of AudioProvider context
* @returns {AudioContextValue} Audio context containing player reference
*/
export const useAudio = (): AudioContextValue => {
 const context = useContext(AudioContext);
 
 if (!context) {
   throw new Error("useAudio must be used within an AudioProvider");
 }

 return context;
};

export default useAudio;