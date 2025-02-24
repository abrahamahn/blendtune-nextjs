// src\client\features\player\components\MusicPlayer.tsx
/**
 * @fileoverview Music player component handling audio playback and controls
 * @module features/player/MusicPlayer
 */

"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@core/store';
import { useAudio } from "@player/hooks";
import {
  setIsPlaying,
  setCurrentTrack,
  setLoopedTrackList,
  setLoopMode,
  setIsVolumeVisible,
  setCurrentTime,
} from "@store/slices";
import { Track } from "@/shared/types/track";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faRepeat,
  faVolumeLow,
  faVolumeXmark,
  faVolumeHigh,
  faPlay,
  faPause,
  faEllipsisVertical,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Waveform from "@visualizer/components/Waveform";

/**
 * Formats time in seconds to MM:SS format
 * @param timeInSeconds - Time to format in seconds
 * @returns Formatted time string
 */
function formatTime(timeInSeconds: number | undefined): string {
  if (typeof timeInSeconds !== "number" || isNaN(timeInSeconds)) {
    return "0:00";
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

/**
 * Main music player component
 * Handles audio playback, controls, and visualization
 */
const MusicPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const { audioRef } = useAudio();

  // Redux state selectors
  const trackList = useSelector((state: RootState) => state.audio.playback.trackList);
  const loopedTrackList = useSelector((state: RootState) => state.audio.playback.loopedTrackList);
  const currentTrack = useSelector(
    (state: RootState) => state.audio.playback.currentTrack as Track | undefined
  );
  const isPlaying = useSelector((state: RootState) => state.audio.playback.isPlaying);
  const isVolumeVisible = useSelector((state: RootState) => state.audio.playback.isVolumeVisible);
  const currentTime = useSelector((state: RootState) => state.audio.playback.currentTime);
  const trackDuration = useSelector((state: RootState) => state.audio.playback.trackDuration);
  const loopMode = useSelector((state: RootState) => state.audio.playback.loopMode);

  // Local state management
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState<number>(0);
  const [volume, setVolume] = useState(1);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [sharedAudioUrl, setSharedAudioUrl] = useState<string>("");

  /**
  * Handles audio source updates when track changes
  * - Pauses current playback
  * - Updates audio source
  * - Loads and plays new track
  */
  useEffect(() => {
    // Return early if audio or track not available
    if (!audioRef.current || !currentTrack) return;
    
    const audioElement = audioRef.current;
    const newSrc = `/audio/tracks/${currentTrack.file}`;
  
    // Update audio source
    audioElement.pause();
    audioElement.src = newSrc;
    audioElement.load();
  
    /**
     * Handles playback once audio is loaded
     * Attempts to play and updates playing state
     */
    const handleLoadedData = () => {
      audioElement
        .play()
        .catch((error) => console.error("Error Playing:", error));
      dispatch(setIsPlaying(true));
    };
  
    // Add one-time event listener for loaded data
    audioElement.addEventListener("loadeddata", handleLoadedData, { once: true });
  
    // Cleanup listener on unmount/track change
    return () => {
      audioElement.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [currentTrack, audioRef, dispatch]);
 
  // Update URL when track changes
  useEffect(() => {
    if (!currentTrack?.file) return;
    const sourceUrl = `/audio/tracks/${currentTrack.file}`;
    setSharedAudioUrl(sourceUrl);
  }, [currentTrack?.file]);

  /**
  * Handles play/pause toggling
  */
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(setIsPlaying(false));
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("❌ Error Playing:", error));
      dispatch(setIsPlaying(true));
    }
  }, [audioRef, isPlaying, dispatch]);


  /**
  * Saves current playback time to localStorage
  */
  const savePlaybackTime = useCallback(() => {
    if (!audioRef.current || !currentTrack?.id) return;
    const time = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const remainingTime = duration - time;
    if (!isNaN(duration) && isFinite(duration) && time > 0) {
      if (remainingTime <= 45) {
        localStorage.setItem(`track-${currentTrack.id}-time`, "0");
      } else {
        localStorage.setItem(`track-${currentTrack.id}-time`, time.toString());
      }
    }
  }, [audioRef, currentTrack]);

   /**
  * Track navigation handlers
  */
  const nextTrack = useCallback(() => {
    if (!trackList.length) return;
    savePlaybackTime();
    const currentIndex = trackList.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex < trackList.length - 1) {
      const next = trackList[currentIndex + 1];
      dispatch(setCurrentTrack(next));
    }
  }, [trackList, currentTrack, dispatch, savePlaybackTime]);

  const previousTrack = useCallback(() => {
    if (!trackList.length) return;
    savePlaybackTime();
    const currentIndex = trackList.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex > 0) {
      const prev = trackList[currentIndex - 1];
      dispatch(setCurrentTrack(prev));
    }
  }, [trackList, currentTrack, dispatch, savePlaybackTime]);

  /**
  * Loop mode cycling handler
  */
  const loopTrack = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
  
    // Cycle through the loop modes: off → one → all → off
    if (loopMode === "off") {
      dispatch(setLoopMode("one"));
      dispatch(setLoopedTrackList([currentTrack]));
    } else if (loopMode === "one") {
      dispatch(setLoopMode("all"));
      dispatch(setLoopedTrackList([]));
    } else if (loopMode === "all") {
      dispatch(setLoopMode("off"));
      dispatch(setLoopedTrackList([]));
    }
  }, [audioRef, currentTrack, loopMode, dispatch]);
  

  // Resize observer for waveform width
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWaveformWidth(entry.contentRect.width);
      }
    });
    if (waveformContainerRef.current) {
      resizeObserver.observe(waveformContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  /**
  * Audio event handlers
  */
 const handleTrackEnd = useCallback(() => {
    if (currentTrack?.id) {
      localStorage.setItem(`track-${currentTrack.id}-time`, "0");
    }

    if (loopMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing audio:", error);
          }
        });
      }
      return;
    }

    if (loopMode === "all") {
      const currentIndex = trackList.findIndex(
        (track) => track.id === currentTrack?.id
      );
      if (currentIndex === trackList.length - 1) {
        dispatch(setCurrentTrack(trackList[0]));
      } else {
        dispatch(setCurrentTrack(trackList[currentIndex + 1]));
      }
      return;
    }

    // Default behavior (loopMode === "off")
    const currentIndex = trackList.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex < trackList.length - 1) {
      dispatch(setCurrentTrack(trackList[currentIndex + 1]));
    }
  }, [trackList, loopMode, currentTrack, dispatch, audioRef]);
  
  const handleTimeUpdate = () => {
    if (audioRef.current && currentTrack?.id) {
      const time = audioRef.current.currentTime;
      dispatch(setCurrentTime(time));
      localStorage.setItem(`track-${currentTrack.id}-time`, time.toString());
    }
  };

  /**
   * Restores saved playback position for returning users
   * Retrieves and applies the last known position for the current track
   */
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.id) return;
    const audioEl = audioRef.current;
    const savedTime = localStorage.getItem(`track-${currentTrack.id}-time`);
    
    // Skip if no saved time or at start
    if (!savedTime || savedTime === "0") return;
    
    const parsedTime = parseFloat(savedTime);
    if (isNaN(parsedTime) || parsedTime >= audioEl.duration) return;
    
    const handleLoadedData = () => {
      audioEl.currentTime = parsedTime;
    };
    
    audioEl.addEventListener("loadeddata", handleLoadedData, { once: true });
    return () => {
      audioEl.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [audioRef, currentTrack]);

  /**
   * Keyboard shortcuts handler
   * - Space: Play/Pause
   * - Arrow Left/Right: Seek -/+ 10s (with Shift: Previous/Next track)
   * - Arrow Up/Down: Volume +/- (with Shift: Max/Min)
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!audioRef.current) return;
      const audioElement = audioRef.current;
      
      switch (event.key) {
        case " ":
        case "Spacebar":
          event.preventDefault();
          togglePlayPause();
          break;
          
        case "ArrowLeft":
          if (event.shiftKey) {
            event.preventDefault();
            previousTrack();
          } else if (!isNaN(audioElement.duration) && isFinite(audioElement.duration)) {
            audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
          }
          break;
          
        case "ArrowRight":
          if (event.shiftKey) {
            event.preventDefault();
            nextTrack();
          } else if (!isNaN(audioElement.duration) && isFinite(audioElement.duration)) {
            audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
          }
          break;
          
        case "ArrowUp":
          event.preventDefault();
          setVolume((prevVolume) => {
            const newVolume = event.shiftKey ? 1 : Math.min(1, prevVolume + 0.02);
            if (audioElement) audioElement.volume = newVolume;
            return newVolume;
          });
          break;
          
        case "ArrowDown":
          event.preventDefault();
          setVolume((prevVolume) => {
            const newVolume = event.shiftKey ? 0 : Math.max(0, prevVolume - 0.02);
            if (audioElement) audioElement.volume = newVolume;
            return newVolume;
          });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audioRef, togglePlayPause, previousTrack, nextTrack]);

  /**
  * Volume control configuration and handlers
  */

  // Calculate volume percentage and icon positioning
  const volPercent = Math.round(volume * 100);
  const iconTransform =
  volPercent === 0 ? "translateX(2.5px)" :
  volPercent === 100 ? "translateX(3.5px)" :
  "translateX(0)";

  /**
  * Determine appropriate volume icon based on level
  */
  const volumeIcon = (() => {
  if (volPercent === 0) return faVolumeXmark;
  if (volPercent === 100) return faVolumeHigh;
  return faVolumeLow;
  })();

  /**
  * Toggle volume control visibility
  */
  const toggleVolume = () => {
  dispatch(setIsVolumeVisible(!isVolumeVisible));
  };

  /**
  * Calculate volume level from mouse position
  */
  const calculateVolume = (clientY: number, rect: DOMRect) => {
  const newVolume = 1 - (clientY - rect.top) / rect.height;
  return Math.max(0, Math.min(1, newVolume));
  };

  /**
  * Handle mouse wheel volume adjustment
  */
  const handleVolumeWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  e.preventDefault();
  const step = 0.08;
  setVolume((prevVolume) => {
    const newVolume = Math.max(0, Math.min(1, prevVolume - Math.sign(e.deltaY) * step));
    if (audioRef.current) audioRef.current.volume = newVolume;
    return newVolume;
  });
  };

  /**
  * Initialize volume drag operation
  */
  const handleVolumeMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
  setIsDraggingVolume(true);
  document.body.style.userSelect = "none";
  document.body.style.cursor = "pointer";
  
  if (volumeBarRef.current) {
    const rect = volumeBarRef.current.getBoundingClientRect();
    const newVolume = calculateVolume(e.clientY, rect);
    if (audioRef.current) audioRef.current.volume = newVolume;
    setVolume(newVolume);
  }
  e.preventDefault();
  };

  /**
  * Handle volume control drag operation
  */
  useEffect(() => {
  if (isDraggingVolume) {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (volumeBarRef.current) {
        const rect = volumeBarRef.current.getBoundingClientRect();
        const newVolume = calculateVolume(e.clientY, rect);
        if (audioRef.current) audioRef.current.volume = newVolume;
        setVolume(newVolume);
      }
      e.preventDefault();
    };
    
    document.addEventListener("mousemove", handleDocumentMouseMove);
    return () => document.removeEventListener("mousemove", handleDocumentMouseMove);
  }
  }, [isDraggingVolume, audioRef]);

  /**
  * Clean up volume drag operation
  */
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
  }, [isDraggingVolume]);

  /**
  * Handle clicks outside volume control
  */
  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (
      volumeContainerRef.current &&
      !volumeContainerRef.current.contains(e.target as Node)
    ) {
      dispatch(setIsVolumeVisible(false));
    }
  };
  
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  /**
  * Global wheel event handler for volume control
  */
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
      dispatch(setIsVolumeVisible(false));
      return;
    }
    if (volume === 0 && wheelEvent.deltaY > 0) {
      dispatch(setIsVolumeVisible(false));
      return;
    }

    // Adjust volume
    const step = 0.05;
    setVolume((prevVolume) => {
      const newVolume = Math.max(0, Math.min(1, prevVolume - Math.sign(wheelEvent.deltaY) * step));
      if (audioRef.current) audioRef.current.volume = newVolume;
      return newVolume;
    });
  };

  const wheelOptions = { passive: false, capture: true } as AddEventListenerOptions;
  document.addEventListener("wheel", handleGlobalWheel, wheelOptions);
  
  return () => {
    document.removeEventListener("wheel", handleGlobalWheel, wheelOptions);
    document.body.style.overflow = "";
  };
  }, [isVolumeVisible, audioRef, dispatch, volume]);

    /**
  * Global wheel event handler for volume control
  */
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
          dispatch(setIsVolumeVisible(false));
          return;
        }
        if (volume === 0 && wheelEvent.deltaY > 0) {
          dispatch(setIsVolumeVisible(false));
          return;
        }
    
        // Adjust volume
        const step = 0.05;
        setVolume((prevVolume) => {
          const newVolume = Math.max(0, Math.min(1, prevVolume - Math.sign(wheelEvent.deltaY) * step));
          if (audioRef.current) audioRef.current.volume = newVolume;
          return newVolume;
        });
      };
    
      const wheelOptions = { passive: false, capture: true } as AddEventListenerOptions;
      document.addEventListener("wheel", handleGlobalWheel, wheelOptions);
      
      return () => {
        document.removeEventListener("wheel", handleGlobalWheel, wheelOptions);
        document.body.style.overflow = "";
      };
    }, [isVolumeVisible, audioRef, dispatch, volume]);
    
  // --- MOUSE WHEEL ON MUSIC PLAYER ---
  const handleMusicPlayerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isVolumeVisible) {
      if (volume === 1 && e.deltaY < 0) {
        dispatch(setIsVolumeVisible(false));
        return;
      }
      if (volume === 0 && e.deltaY > 0) {
        dispatch(setIsVolumeVisible(false));
        return;
      }
    }
    const step = 0.05;
    setVolume((prevVolume) => {
      const newVolume = Math.max(0, Math.min(1, prevVolume - Math.sign(e.deltaY) * step));
      if (audioRef.current) audioRef.current.volume = newVolume;
      return newVolume;
    });
  };

  // RENDER
  const playPauseButton = isPlaying ? (
    <FontAwesomeIcon icon={faPause} size="xl" className="text-[#1F1F1F] dark:text-white" />
  ) : (
    <FontAwesomeIcon icon={faPlay} size="xl"className="ml-0.5 text-[#1F1F1F] dark:text-white" />
  );
  const playPauseButtonMobile = isPlaying ? (
    <FontAwesomeIcon icon={faPause} size="lg" className="text-[#1F1F1F] dark:text-white" />
  ) : (
    <FontAwesomeIcon icon={faPlay} size="lg" className="ml-0.5 text-[#1F1F1F] dark:text-white" />
  );

  return (
    <div onWheelCapture={handleMusicPlayerWheel}>
      {/* DESKTOP PLAYER */}
      <div className="hidden md:block fixed bottom-0 left-0 w-full flex justify-center items-center">
          <audio
            className="hidden"
            ref={audioRef}
            autoPlay={isPlaying}
            onEnded={handleTrackEnd}
            onPause={() => dispatch(setIsPlaying(false))}
            onPlay={() => dispatch(setIsPlaying(true))}
            onTimeUpdate={handleTimeUpdate}
            preload="none"
          >
            {sharedAudioUrl && (
              <source src={sharedAudioUrl} type="audio/webm" />
            )}
          </audio>
        <div className="flex flex-row items-center justify-center w-full h-20 border-t dark:border-neutral-800 bg-white dark:bg-transparent border-neutral-300 backdrop-blur-md lg:px-6 px-0">
          {/* Playback Buttons */}
          <div className="flex flex-row w-32 md:w-48 h-full items-center justify-center">
            <div className="items-center mr-4 p-2">
              <FontAwesomeIcon
                icon={faBackwardStep}
                size="lg"
                onClick={previousTrack}
                className="cursor-pointer hover:opacity-75 text-[#1F1F1F] dark:text-white"
              />
            </div>
            <button
              className="flex rounded-full w-10 h-10 items-center justify-center user-select-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              <div className="cursor-pointer hover:opacity-75 text-[#070707] dark:text-white">
                {playPauseButton}
              </div>
            </button>
            <div className="items-center p-2 ml-4">
              <FontAwesomeIcon
                icon={faForwardStep}
                size="lg"
                onClick={nextTrack}
                className="cursor-pointer hover:opacity-75 text-[#1F1F1F] dark:text-white"
              />
            </div>
            <button
              className="relative items-center p-2 ml-4 cursor-pointer focus:outline-none focus:ring-0"
              onClick={loopTrack}
            >
              <FontAwesomeIcon
                icon={faRepeat}
                size="sm"
                className={`cursor-pointer hover:opacity-75 ${loopMode !== "off" ? "text-blue-500" : "text-[#1F1F1F] dark:text-white"}`}
              />
              {loopMode !== "off" && (
                <p className="absolute bottom-1 right-0 text-2xs text-blue-500">
                  {loopMode === "one" ? "1" : "all"}
                </p>
              )}
            </button>
          </div>
          {/* Waveform & Timestamp */}
          <div className="flex flex-row w-1/2 h-full items-center px-4">
          <div ref={waveformContainerRef} className="flex-1 min-w-0 overflow-hidden">
              {currentTrack?.file && sharedAudioUrl ? (
                <Waveform
                  audioUrl={sharedAudioUrl}
                  audioRef={audioRef}
                  amplitude={0.5}
                  currentTime={audioRef.current?.currentTime || 0}
                  trackDuration={audioRef.current?.duration || 0}
                  width={waveformWidth}
                  updateCurrentTime={(newTime: number) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = newTime;
                      dispatch(setCurrentTime(newTime));
                    }
                  }}
                />
              ) : (
                <p />
              )}
            </div>
            <div className="hidden lg:flex text-xs ml-2 w-20 h-full shrink-0 items-center justify-center user-select-none">
              <p className="text-[#1F1F1F] dark:text-white">
                {formatTime(audioRef.current?.currentTime)}
                <span className="text-transparent"> / </span>
                <span className="text-[#070707] dark:text-neutral-500">
                  {formatTime(trackDuration)}
                </span>
              </p>
            </div>
            {/* Volume Icon & Slider */}
            <div ref={volumeContainerRef} className="relative shrink-0 flex justify-center md:w-12 mr-3">
              <button
                onClick={toggleVolume}
                className="focus:outline-none focus:ring-0 inline-block w-10 h-10"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={volumeIcon}
                    size="sm"
                    style={{ transform: iconTransform }}
                    className="cursor-pointer hover:opacity-75 text-[#1F1F1F] dark:text-white"
                  />
                </div>
              </button>
              {isVolumeVisible && (
                <div
                  onMouseDown={handleVolumeMouseDown}
                  onWheel={handleVolumeWheel}
                  className="volume-bar select-none cursor-pointer bg-neutral-50 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 h-28 w-6 rounded-full absolute bottom-10 right-[9px] transform z-10 flex justify-center items-center"
                >
                  <div
                    ref={volumeBarRef}
                    className="bg-blue-600 rounded-lg h-20 w-1 cursor-pointer relative"
                  >
                    <div
                      className="bg-neutral-200 dark:bg-neutral-500 rounded-lg w-1"
                      style={{ height: `${(1 - volume) * 100}%` }}
                    />
                    <div
                      className="rounded-full h-3 w-3 bg-blue-600 absolute cursor-pointer"
                      style={{
                        bottom: `${volume * 100}% - [5px]`,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 50,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Song Info & Action Buttons */}
          <div className="flex items-center h-full w-full max-w-90 justify-center">

            {/* Album Art */}
            <div className="relative h-12 w-12 lg:h-16 lg:w-16 dark:bg-black/70 bg-neutral-90/70 rounded-md ml-2">
              <div className="flex items-center justify-center h-12 w-12 lg:h-16 lg:w-16 ml-0 rounded-md p-0.5 md:p-0.5">
                <Image
                  crossOrigin="anonymous"
                  src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${currentTrack?.metadata?.catalog ?? "default"}.jpg`}
                  alt={currentTrack?.metadata?.title ?? ""}
                  className="w-full h-full object-cover rounded-md shadow-md cursor-pointer hover:opacity-75"
                  width={64}
                  height={64}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Song Info */}
            <div className="flex flex-col justify-center p-4 min-w-40 max-w-40 lg:min-w-60 lg:max-w-60 h-full">
              <div className="flex flex-col">
                <button className="cursor-pointer text-left">
                  <p
                    className="text-neutral-600 dark:text-neutral-200 text-xs lg:text-sm font-semibold mb-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {currentTrack?.metadata?.title.toUpperCase()}
                    {/* Extra details only show on medium screens and above */}
                    <span className="hidden md:inline">
                      {" ["}
                      {currentTrack?.info?.mood?.[1]}, {currentTrack?.info?.relatedartist?.[0]}
                      {"]"}
                    </span>
                  </p>
                </button>
              </div>
              <div className="flex flex-row space-x-2">
                <p className="text-2xs text-neutral-500 dark:text-white px-2 border border-neutral-500 dark:border-neutral-500 rounded-md">
                  {currentTrack?.info?.key?.note} {currentTrack?.info?.key?.scale.substring(0, 3).toLowerCase()}
                </p>
                <p className="text-2xs text-neutral-500 dark:text-neutral-200 bg-transparent dark:bg-neutral-500/50 rounded-md w-14 text-center border border-neutral-500 dark:border-transparent">
                  {currentTrack?.info?.bpm} BPM
                </p>
                <p className="hidden lg:flex items-center justify-center text-2xs bg-blue-600 dark:bg-blue-600 text-white rounded-md w-12 text-center">
                  {currentTrack?.info?.genre[0]?.maingenre}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row justify-center items-center w-16 lg:w-28 h-full space-x-2">
              <div className="w-8 h-8 flex items-center justify-center p-2 rounded-full cursor-pointer hover:opacity-75">
                <FontAwesomeIcon icon={faPlus} className="text-[#6D6D6D] dark:text-white" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center p-2 rounded-full cursor-pointer hover:opacity-75">
                <FontAwesomeIcon icon={faHeart} className="text-[#6D6D6D] dark:text-white" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center p-2 rounded-full cursor-pointer hover:opacity-75">
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-[#6D6D6D] dark:text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE PLAYER */}
      <div className="fixed px-3 rounded-lg bottom-4 w-full h-14 z-0 block md:hidden">
        <div className="border dark:border-neutral-800 flex flex-col justify-center items-center w-full rounded-lg border-neutral-200 bg-white/90 dark:bg-black/90 overflow-hidden h-full backdrop-blur-md">
          {/* Progress Bar */}
          <div className="w-full" style={{ width: "calc(100% + 11px)" }}>
            <div
              className="w-full border-md bg-black/10 dark:bg-white/10 h-1 rounded-full shadow-xl overflow-hidden cursor-pointer"
              onClick={(e) => {
                if (!audioRef.current) return;
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const newPercentage = (mouseX / rect.width) * 100;
                const newPlaybackPosition = (newPercentage / 100) * (trackDuration || 0);
                audioRef.current.currentTime = newPlaybackPosition;
              }}
            >
              <div
                className="bg-[#1F1F1F] dark:bg-blue-600 h-1 rounded-md shadow-md w-full transition-width duration-100 ease-in-out"
                style={{
                  width: `${
                    ((currentTime || 0) / (audioRef.current?.duration || 1)) * 100
                  }%`,
                }}
              />
            </div>
          </div>
          {/* Main Controls */}
          <div className="flex items-center justify-start w-full h-full">
            {/* Artwork Image at the very left */}
            <div className="flex items-center justify-center">
              <Image
                crossOrigin="anonymous"
                src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${currentTrack?.metadata?.catalog ?? "default"}.jpg`}
                alt={currentTrack?.metadata?.title ?? ""}
                className="h-full object-cover shadow-md"
                width={50}
                height={50}
                loading="lazy"
              />
            </div>
            {/* Text Content: Title/Producer & Key/BPM */}
            <div className="flex items-center justify-between ml-3 flex-grow h-full">
              {/* Left Section: Title and Producer */}
              <div className="flex flex-col">
                <button className="cursor-pointer">
                  <p className="text-left text-[#1F1F1F] dark:text-neutral-200 text-sm font-semibold">
                    {currentTrack?.metadata?.title.toUpperCase()}
                  </p>
                </button>
                <p className="text-xs text-[#707070] dark:text-neutral-400">
                  {currentTrack?.metadata?.producer}
                </p>
              </div>
              {/* Right Section: Key and BPM */}
              <div className="flex items-center">
                <p className="text-2xs border-[#707070] text-[#F9F9F9] md:text-[#707070] px-2 mr-1 bg-blue-400 dark:bg-blue-500 rounded-md">
                  {currentTrack?.info?.key?.note}
                  {currentTrack?.info?.key?.scale.substring(0, 3)}
                </p>
                <p className="text-2xs text-[#F9F9F9] mr-1 bg-blue-500 dark:bg-blue-700 px-2 rounded-md">
                  {currentTrack?.info?.bpm}BPM
                </p>
              </div>
            </div>
            {/* Play/Pause Button */}
            <div className="flex flex-row justify-center items-center w-10">
              <button
                  className="flex w-10 h-10 items-center justify-center user-select-none p-0"
                  onClick={nextTrack}
                >
                <div className="cursor-pointer hover:opacity-75">
                  <FontAwesomeIcon
                    icon={faHeart}
                    size="lg"
                    className="cursor-pointer hover:opacity-90 text-[#1F1F1F] dark:text-white"
                  />
                </div>
              </button>
            </div>
            <div className="flex flex-row justify-center items-center w-10">
              <button
                className="w-10 items-center justify-center user-select-none p-0"
                onClick={togglePlayPause}
              >
                <div className="cursor-pointer hover:opacity-90">
                  {playPauseButtonMobile}
                </div>
              </button>
            </div>
            <div className="flex flex-row justify-center items-center w-10">
              <button
                  className="flex w-10 h-10 items-center justify-center user-select-none p-0"
                  onClick={nextTrack}
                >
                <div className="cursor-pointer hover:opacity-90">
                  <FontAwesomeIcon
                    icon={faForwardStep}
                    size="lg"
                    className="cursor-pointer hover:opacity-90 text-[#1F1F1F] dark:text-white"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
