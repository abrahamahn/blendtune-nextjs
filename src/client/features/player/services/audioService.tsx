// src/client/features/player/services/audioService.tsx
"use client";

import React, {
 useRef,
 ReactNode,
 createContext,
 RefObject,
} from "react";

/**
* Type definition for the audio service context value
* Contains reference to the main audio element used throughout the app
*/
interface AudioServiceType {
 audioRef: RefObject<HTMLAudioElement | null>;
}

/**
* Props for the AudioService provider component
*/
interface AudioServiceProps {
 children: ReactNode;
}

/**
* Context for sharing audio element reference across components
* Must be accessed through a provider higher in the component tree
*/
export const AudioContext = createContext<AudioServiceType | undefined>(undefined);

/**
* Provider component that manages the shared audio element reference
* Wraps application components that need access to audio playback
* 
* @example
* ```tsx
* <AudioService>
*   <App />
* </AudioService>
* ```
*/
const AudioService: React.FC<AudioServiceProps> = ({ children }) => {
 // Initialize non-null audio reference for HTML5 audio element
 const audioRef = useRef<HTMLAudioElement>(null!);

 return (
   <AudioContext.Provider value={{ audioRef }}>
     {children}
   </AudioContext.Provider>
 );
};

export default AudioService;