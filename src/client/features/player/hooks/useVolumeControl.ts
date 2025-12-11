// src\client\features\player\hooks\useVolumeControl.ts
import { useState, useCallback, useEffect, useMemo, RefObject, useRef } from "react";
import { faVolumeLow, faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { usePlayer, playerActions } from "@/client/features/player/services/playerService";

/**
 * Manages core volume state and basic operations
 */
export const useVolumeState = (initialVolume = 0.5) => {
  const { audioRef, volume: storedVolume, dispatch } = usePlayer();
  const [localVolume, setLocalVolume] = useState(storedVolume);
  
  // Keep track of previous non-zero volume for mute/unmute
  const prevVolumeRef = useRef(storedVolume > 0 ? storedVolume : initialVolume);
  
  // Flag to prevent circular updates
  const updatingRef = useRef(false);

  // Sync local state with context state when it changes externally
  useEffect(() => {
    if (!updatingRef.current && storedVolume !== localVolume) {
      setLocalVolume(storedVolume);
    }
  }, [storedVolume, localVolume]);

  /**
   * Update volume level
   */
  const setVolume = useCallback((newVolume: number) => {
    // Prevent circular updates
    if (updatingRef.current) return;
    updatingRef.current = true;
    
    try {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      
      // Store non-zero volume for future unmute
      if (clampedVolume > 0) {
        prevVolumeRef.current = clampedVolume;
      }
      
      // Update audio element volume
      if (audioRef.current) {
        audioRef.current.volume = clampedVolume;
      }
      
      // Update global state
      dispatch(playerActions.setVolume(clampedVolume));
      
      // Update local state
      setLocalVolume(clampedVolume);
    } finally {
      // Reset flag with slight delay to ensure updates are processed
      setTimeout(() => {
        updatingRef.current = false;
      }, 0);
    }
  }, [audioRef, dispatch]);

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    if (localVolume > 0) {
      // Store current volume before muting
      prevVolumeRef.current = localVolume;
      setVolume(0);
    } else {
      // Restore previous volume
      setVolume(prevVolumeRef.current);
    }
  }, [localVolume, setVolume]);

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
  
  // Use refs to track values without causing re-renders
  const volumeRef = useRef(volume);
  
  // Update ref when value changes
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

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
    // Ref to store handler function
    const handleMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
    
    useEffect(() => {
      // Create handler function
      handleMouseMoveRef.current = (e: MouseEvent) => {
        const rect = volumeBarRef.current?.getBoundingClientRect();
        if (rect) {
          const newVolume = calculateVolume(e.clientY, rect);
          setVolume(newVolume);
        }
        e.preventDefault();
      };
      
      // Add event listener if dragging
      if (isDraggingVolume && volumeBarRef.current) {
        document.addEventListener("mousemove", handleMouseMoveRef.current);
        return () => {
          if (handleMouseMoveRef.current) {
            document.removeEventListener("mousemove", handleMouseMoveRef.current);
          }
        };
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
  // Use refs to track values without causing re-renders
  const volumeRef = useRef(volume);
  
  // Update ref when value changes
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  /**
   * Handle mouse wheel volume adjustment
   */
  const handleVolumeWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const step = 0.05;
    const newVolume = Math.max(0, Math.min(1, volumeRef.current - Math.sign(e.deltaY) * step));
    setVolume(newVolume);
  }, [setVolume]);

  /**
   * Global wheel event handler for volume control
   */
  const useGlobalWheel = () => {
    const { isVolumeVisible } = usePlayer();
    
    // Function ref to avoid recreation on each render
    const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null);

    useEffect(() => {
      // Create or update the handler function
      wheelHandlerRef.current = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Handle volume limits
        if (volumeRef.current === 1 && e.deltaY < 0) {
          toggleVolumeVisibility();
          return;
        }
        if (volumeRef.current === 0 && e.deltaY > 0) {
          toggleVolumeVisibility();
          return;
        }

        // Adjust volume
        const step = 0.05;
        const newVolume = Math.max(0, Math.min(1, volumeRef.current - Math.sign(e.deltaY) * step));
        setVolume(newVolume);
      };

      if (!isVolumeVisible) {
        document.body.style.overflow = "";
        return;
      }

      document.body.style.overflow = "hidden";
      
      const wheelOptions = { passive: false, capture: true } as AddEventListenerOptions;
      document.addEventListener("wheel", wheelHandlerRef.current, wheelOptions);
      
      return () => {
        if (wheelHandlerRef.current) {
          document.removeEventListener("wheel", wheelHandlerRef.current, wheelOptions);
        }
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
  
  // Flag to prevent circular updates
  const updatingRef = useRef(false);

  /**
   * Toggle volume control visibility
   */
  const toggleVolumeVisibility = useCallback(() => {
    // Prevent circular updates
    if (updatingRef.current) return;
    updatingRef.current = true;
    
    try {
      dispatch(playerActions.setIsVolumeVisible(!isVolumeVisible));
    } finally {
      // Reset flag with slight delay
      setTimeout(() => {
        updatingRef.current = false;
      }, 0);
    }
  }, [isVolumeVisible, dispatch]);

  /**
   * Handle clicks outside volume control
   */
  const useOutsideClick = (volumeContainerRef: RefObject<HTMLDivElement | null>) => {
    // Function ref to avoid recreation on each render
    const clickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
    
    useEffect(() => {
      // Create or update the handler function
      clickHandlerRef.current = (e: MouseEvent) => {
        if (
          volumeContainerRef.current &&
          !volumeContainerRef.current.contains(e.target as Node)
        ) {
          toggleVolumeVisibility();
        }
      };
      
      if (isVolumeVisible) {
        document.addEventListener("mousedown", clickHandlerRef.current);
        return () => {
          if (clickHandlerRef.current) {
            document.removeEventListener("mousedown", clickHandlerRef.current);
          }
        };
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
 * Calculates volume based on the vertical mouse position and the element's bounding rectangle.
 *
 * @param clientY The vertical mouse position (in client coordinates).
 * @param rect The bounding rectangle of the volume bar element.
 * @returns A clamped volume value between 0 and 1.
 */
export const calculateVolume = (clientY: number, rect: DOMRect): number => {
  const newVolume = 1 - (clientY - rect.top) / rect.height;
  return Math.max(0, Math.min(1, newVolume));
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
    ...volumeWheel,
    calculateVolume
  };
};

export default useVolumeControl;