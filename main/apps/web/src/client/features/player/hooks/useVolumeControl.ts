// main/apps/web/src/client/features/player/hooks/useVolumeControl.ts
import {
  calculateVolume,
  useVolumeDisplay,
  useVolumeState,
} from "./volume/useVolumeState";
import {
  useVolumeDrag,
  useVolumeVisibility,
  useVolumeWheel,
} from "./volume/useVolumeInteractions";

const useVolumeControl = () => {
  const volumeState = useVolumeState();
  const volumeDisplay = useVolumeDisplay(volumeState.volume);
  const volumeVisibility = useVolumeVisibility();
  const volumeDrag = useVolumeDrag(volumeState.volume, volumeState.setVolume);
  const volumeWheel = useVolumeWheel(
    volumeState.volume,
    volumeState.setVolume,
    volumeVisibility.toggleVolumeVisibility,
  );

  return {
    ...volumeState,
    ...volumeDisplay,
    ...volumeVisibility,
    ...volumeDrag,
    ...volumeWheel,
    calculateVolume,
  };
};

export default useVolumeControl;
