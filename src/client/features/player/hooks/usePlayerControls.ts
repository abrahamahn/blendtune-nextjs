// src/client/features/player/hooks/usePlayerControls.ts
import { useTrackNavigation } from "./useTrackNavigation";
import { usePlayer } from "../services/playerService";

export const usePlayerControls = () => {
  const navigation = useTrackNavigation();
  const { setVolume } = usePlayer();

  return {
    ...navigation,
    setVolume,
  };
};
