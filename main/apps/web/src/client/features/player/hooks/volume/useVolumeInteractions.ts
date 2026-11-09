// main/apps/web/src/client/features/player/hooks/volume/useVolumeInteractions.ts
import { useState, useCallback, useEffect, RefObject, useRef } from "react";
import { usePlayer } from "@client/features/player/services/playerService";
import { playerActions } from "@client/features/player/context/playerActions";
import { calculateVolume } from "./useVolumeState";

/**
 * Manages volume drag interactions.
 */
export const useVolumeDrag = (
  volume: number,
  setVolume: (newVolume: number) => void,
) => {
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const handleVolumeMouseDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      volumeBarRef: RefObject<HTMLDivElement | null>,
    ) => {
      if (!volumeBarRef.current) return;

      setIsDraggingVolume(true);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "pointer";

      const rect = volumeBarRef.current.getBoundingClientRect();
      const newVolume = calculateVolume(e.clientY, rect);
      setVolume(newVolume);

      e.preventDefault();
    },
    [setVolume],
  );

  const useDragListeners = (volumeBarRef: RefObject<HTMLDivElement | null>) => {
    const handleMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);

    useEffect(() => {
      handleMouseMoveRef.current = (e: MouseEvent) => {
        const rect = volumeBarRef.current?.getBoundingClientRect();
        if (rect) {
          const newVolume = calculateVolume(e.clientY, rect);
          setVolume(newVolume);
        }
        e.preventDefault();
      };

      if (isDraggingVolume && volumeBarRef.current) {
        document.addEventListener("mousemove", handleMouseMoveRef.current);
        return () => {
          if (handleMouseMoveRef.current) {
            document.removeEventListener(
              "mousemove",
              handleMouseMoveRef.current,
            );
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
      return () =>
        document.removeEventListener("mouseup", handleDocumentMouseUp);
    }, []);
  };

  return {
    handleVolumeMouseDown,
    useDragListeners,
  };
};

/**
 * Manages volume wheel interactions.
 */
export const useVolumeWheel = (
  volume: number,
  setVolume: (newVolume: number) => void,
  toggleVolumeVisibility: () => void,
) => {
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const handleVolumeWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const step = 0.05;
      const newVolume = Math.max(
        0,
        Math.min(1, volumeRef.current - Math.sign(e.deltaY) * step),
      );
      setVolume(newVolume);
    },
    [setVolume],
  );

  const useGlobalWheel = () => {
    const { isVolumeVisible } = usePlayer();
    const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null);

    useEffect(() => {
      wheelHandlerRef.current = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (volumeRef.current === 1 && e.deltaY < 0) {
          toggleVolumeVisibility();
          return;
        }
        if (volumeRef.current === 0 && e.deltaY > 0) {
          toggleVolumeVisibility();
          return;
        }

        const step = 0.05;
        const newVolume = Math.max(
          0,
          Math.min(1, volumeRef.current - Math.sign(e.deltaY) * step),
        );
        setVolume(newVolume);
      };

      if (!isVolumeVisible) {
        document.body.style.overflow = "";
        return;
      }

      document.body.style.overflow = "hidden";

      const wheelOptions = {
        passive: false,
        capture: true,
      } as AddEventListenerOptions;
      document.addEventListener("wheel", wheelHandlerRef.current, wheelOptions);

      return () => {
        if (wheelHandlerRef.current) {
          document.removeEventListener(
            "wheel",
            wheelHandlerRef.current,
            wheelOptions,
          );
        }
        document.body.style.overflow = "";
      };
    }, [isVolumeVisible]);
  };

  return {
    handleVolumeWheel,
    useGlobalWheel,
  };
};

/**
 * Manages volume visibility and outside click dismissal.
 */
export const useVolumeVisibility = () => {
  const { isVolumeVisible, dispatch } = usePlayer();
  const updatingRef = useRef(false);

  const toggleVolumeVisibility = useCallback(() => {
    if (updatingRef.current) return;
    updatingRef.current = true;

    try {
      dispatch(playerActions.setIsVolumeVisible(!isVolumeVisible));
    } finally {
      setTimeout(() => {
        updatingRef.current = false;
      }, 0);
    }
  }, [isVolumeVisible, dispatch]);

  const useOutsideClick = (
    volumeContainerRef: RefObject<HTMLDivElement | null>,
  ) => {
    const clickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

    useEffect(() => {
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
    useOutsideClick,
  };
};
