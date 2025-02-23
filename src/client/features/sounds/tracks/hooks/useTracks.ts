// src\client\features\sounds\tracks\hooks\useTracks.ts
import { useContext } from "react";
import { TracksContext } from "@tracks/services";

export const useTracks = () => {
    const context = useContext(TracksContext);
    if (!context) {
      throw new Error("useTracks must be used within a TracksProvider");
    }
    return context;
  };