import { useState, useCallback, useEffect, useMemo, RefObject } from "react";
import { faVolumeLow, faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";

/**
 * Manages core volume state and basic operations
 */
export const useVolumeState = (initialVolume = 0.5) => {
  const { audioRef, volume: storedVolume, dispatch } = usePlayer();
  const [localVolume, setLocalVolume] = useState(storedVolume);

  /**
   * Update volume level
   */
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    // Update audio element volume
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    // Update global state
    dispatch(playerActions.setVolume(clampedVolume));
    
    // Update local state
    setLocalVolume(clampedVolume);
  }, [audioRef, dispatch]);

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    if (localVolume > 0) {
      // Store current volume before muting
      setVolume(0);
    } else {
      // Restore previous volume (or default to 0.5)
      setVolume(initialVolume);
    }
  }, [localVolume, initialVolume, setVolume]);

  return {
    volume: localVolume,
    setVolume,
    toggleMute
  };
};

/**
 * Provides volume-related UI icon and transform calculations
 */
export const useVolumeDisplay = (volume: number) => {
  /**
   * Determine appropriate volume icon based on level
   */
  const volumeIcon = useMemo((): IconDefinition => {
    const volPercent = Math.round(volume * 100);
    
    if (volPercent === 0) return faVolumeXmark;
    if (volPercent >= 70) return faVolumeHigh;
    return faVolumeLow;
  }, [volume]);

  /**
   * Calculate icon transform based on volume percentage
   */
  const iconTransform = useMemo(() => {
    const volPercent = Math.round(volume * 100);
    return volPercent === 0 ? "translateX(2.5px)" :
           volPercent === 100 ? "translateX(3.5px)" :
           "translateX(0)";
  }, [volume]);

  return {
    volumeIcon,
    iconTransform
  };
};

/**
 * Manages volume drag interactions
 */
export const useVolumeDrag = (
  volume: number, 
  setVolume: (newVolume: number) => void
) => {
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  /**
   * Calculate volume level from mouse position
   */
  const calculateVolume = useCallback((clientY: number, rect: DOMRect): number => {
    const newVolume = 1 - (clientY - rect.top) / rect.height;
    return Math.max(0, Math.min(1, newVolume));
  }, []);

  /**
   * Handle volume drag start
   */
  const handleVolumeMouseDown = useCallback((
    e: React.MouseEvent<HTMLDivElement>, 
    volumeBarRef: RefObject<HTMLDivElement | null>
  ) => {
    if (!volumeBarRef.current) return;

    setIsDraggingVolume(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "pointer";
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    const newVolume = calculateVolume(e.clientY, rect);
    setVolume(newVolume);
    
    e.preventDefault();
  }, [calculateVolume, setVolume]);

  /**
   * Attach document-level drag event listeners
   */
  const useDragListeners = (volumeBarRef: RefObject<HTMLDivElement | null>) => {
    useEffect(() => {
      if (isDraggingVolume && volumeBarRef.current) {
        const handleDocumentMouseMove = (e: MouseEvent) => {
          const rect = volumeBarRef.current?.getBoundingClientRect();
          if (rect) {
            const newVolume = calculateVolume(e.clientY, rect);
            setVolume(newVolume);
          }
          e.preventDefault();
        };
        
        document.addEventListener("mousemove", handleDocumentMouseMove);
        return () => document.removeEventListener("mousemove", handleDocumentMouseMove);
      }
    }, [volumeBarRef]);

    useEffect(() => {
      const handleDocumentMouseUp = () => {
        if (isDraggingVolume) {
          setIsDraggingVolume(false);
          document.body.style.userSelect = "";
          document.body.style.cursor = "";
        }
      };
      
      document.addEventListener("mouseup", handleDocumentMouseUp);
      return () => document.removeEventListener("mouseup", handleDocumentMouseUp);
    }, []);
  };

  return {
    handleVolumeMouseDown,
    useDragListeners
  };
};

/**
 * Manages volume wheel interactions
 */
export const useVolumeWheel = (
  volume: number, 
  setVolume: (newVolume: number) => void,
  toggleVolumeVisibility: () => void
) => {
  /**
   * Handle mouse wheel volume adjustment
   */
  const handleVolumeWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const step = 0.05;
    const newVolume = Math.max(0, Math.min(1, volume - Math.sign(e.deltaY) * step));
    setVolume(newVolume);
  }, [volume, setVolume]);

  /**
   * Global wheel event handler for volume control
   */
  const useGlobalWheel = () => {
    const { isVolumeVisible } = usePlayer();

    useEffect(() => {
      if (!isVolumeVisible) {
        document.body.style.overflow = "";
        return;
      }

      document.body.style.overflow = "hidden";
      
      const handleGlobalWheel: EventListener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wheelEvent = e as WheelEvent;

        // Handle volume limits
        if (volume === 1 && wheelEvent.deltaY < 0) {
          toggleVolumeVisibility();
          return;
        }
        if (volume === 0 && wheelEvent.deltaY > 0) {
          toggleVolumeVisibility();
          return;
        }

        // Adjust volume
        const step = 0.05;
        const newVolume = Math.max(0, Math.min(1, volume - Math.sign(wheelEvent.deltaY) * step));
        setVolume(newVolume);
      };

      const wheelOptions = { passive: false, capture: true } as AddEventListenerOptions;
      document.addEventListener("wheel", handleGlobalWheel, wheelOptions);
      
      return () => {
        document.removeEventListener("wheel", handleGlobalWheel, wheelOptions);
        document.body.style.overflow = "";
      };
    }, [isVolumeVisible]);
  };

  return {
    handleVolumeWheel,
    useGlobalWheel
  };
};

/**
 * Manages volume visibility and outside click
 */
export const useVolumeVisibility = () => {
  const { isVolumeVisible, dispatch } = usePlayer();

  /**
   * Toggle volume control visibility
   */
  const toggleVolumeVisibility = useCallback(() => {
    dispatch(playerActions.setIsVolumeVisible(!isVolumeVisible));
  }, [isVolumeVisible, dispatch]);

  /**
   * Handle clicks outside volume control
   */
  const useOutsideClick = (volumeContainerRef: RefObject<HTMLDivElement | null>) => {
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          volumeContainerRef.current &&
          !volumeContainerRef.current.contains(e.target as Node)
        ) {
          toggleVolumeVisibility();
        }
      };
      
      if (isVolumeVisible) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [volumeContainerRef]);
  };

  return {
    isVolumeVisible,
    toggleVolumeVisibility,
    useOutsideClick
  };
};

/**
 * Combines all volume control hooks
 */
export const useVolumeControl = () => {
  const volumeState = useVolumeState();
  const volumeDisplay = useVolumeDisplay(volumeState.volume);
  const volumeVisibility = useVolumeVisibility();
  const volumeDrag = useVolumeDrag(volumeState.volume, volumeState.setVolume);
  const volumeWheel = useVolumeWheel(
    volumeState.volume, 
    volumeState.setVolume, 
    volumeVisibility.toggleVolumeVisibility
  );

  return {
    ...volumeState,
    ...volumeDisplay,
    ...volumeVisibility,
    ...volumeDrag,
    ...volumeWheel
  };
};

export default useVolumeControl;