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
import { RootState } from "@/client/environment/redux/store";
import { useAudio } from "@/client/environment/services/audioService";
import { useTracks } from "@/client/environment/services/trackService";
import {
  setIsPlaying,
  setCurrentTrack,
  setIsLoopEnabled,
  setIsVolumeVisible,
  setCurrentTime,
  setTrackDuration,
  setTrackInfo,
} from "@/client/environment/redux/slices/playback";

import { Track } from "@/shared/types/track";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faRepeat,
  faVolumeLow,
  faPlay,
  faPause,
  faEllipsisVertical,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

import Waveform from "@/client/ui/components/visualizer/Waveform";

function formatTime(timeInSeconds: number | undefined) {
  if (typeof timeInSeconds !== "number" || isNaN(timeInSeconds)) {
    return "0:00";
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const MusicPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const { audioRef } = useAudio(); // Grab your global audioRef
  const { tracks } = useTracks();

  // Redux store states
  const currentTrack = useSelector(
    (state: RootState) => state.audio.playback.currentTrack as Track | undefined
  );
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );
  const isVolumeVisible = useSelector(
    (state: RootState) => state.audio.playback.isVolumeVisible
  );
  const isLoopEnabled = useSelector(
    (state: RootState) => state.audio.playback.isLoopEnabled
  );
  const currentTime = useSelector(
    (state: RootState) => state.audio.playback.currentTime
  );
  const trackDuration = useSelector(
    (state: RootState) => state.audio.playback.trackDuration
  );

  // Local states
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState<number>(0);

  // Volume-related states
  const [volume, setVolume] = useState(1);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  // Refs for the volume container and the inner blue bar
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) PLAY/PAUSE TOGGLE
  // ─────────────────────────────────────────────────────────────────────────────
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      console.log("Pausing track:", currentTrack?.file);
      audioRef.current.pause();
    } else {
      console.log("Playing track:", currentTrack?.file);
      audioRef.current.volume = volume; // keep user-set volume
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing the track:", error));
    }
  }, [audioRef, isPlaying, currentTrack?.file, volume]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) PREVIOUS/NEXT TRACK
  // ─────────────────────────────────────────────────────────────────────────────
  const previousTrack = useCallback(() => {
    const currentIndex = tracks.findIndex(
      (track: Track) => track.id === currentTrack?.id
    );
    if (currentIndex > 0) {
      const prev = tracks[currentIndex - 1];
      console.log("Switching to previous track:", prev.file);
      dispatch(setCurrentTrack(prev));
      dispatch(setIsPlaying(true));
    }
  }, [tracks, currentTrack?.id, dispatch]);

  const nextTrack = useCallback(() => {
    const currentIndex = tracks.findIndex(
      (track: Track) => track.id === currentTrack?.id
    );
    if (currentIndex < tracks.length - 1) {
      const nxt = tracks[currentIndex + 1];
      console.log("Switching to next track:", nxt.file);
      dispatch(setCurrentTrack(nxt));
      dispatch(setIsPlaying(true));
    }
  }, [tracks, currentTrack?.id, dispatch]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) LOOP
  // ─────────────────────────────────────────────────────────────────────────────
  const loopTrack = useCallback(() => {
    if (!audioRef.current) return;
    const newLoopState = !isLoopEnabled;
    dispatch(setIsLoopEnabled(newLoopState));
    audioRef.current.loop = newLoopState;
    console.log("Loop state changed to:", newLoopState);
  }, [audioRef, dispatch, isLoopEnabled]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) OPEN TRACK INFO
  // ─────────────────────────────────────────────────────────────────────────────
  const openTrackInfo = () => {
    dispatch(setTrackInfo(true));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) RESIZE OBSERVER (for Waveform width)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setWaveformWidth(width);
      }
    });
    if (waveformContainerRef.current) {
      resizeObserver.observe(waveformContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) AUDIO EVENT HANDLERS: onPlay, onPause, onTimeUpdate...
  // ─────────────────────────────────────────────────────────────────────────────
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  useEffect(() => {
    const currentAudio = audioRef.current;
    if (!currentAudio) return;

    const handleLoadedMetadata = () => {
      dispatch(setTrackDuration(currentAudio.duration));
      currentAudio.loop = isLoopEnabled;
    };

    currentAudio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      currentAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [dispatch, audioRef, isLoopEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!audioRef.current) return;
      switch (event.key) {
        case " ":
        case "Spacebar":
          event.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          audioRef.current.currentTime = Math.max(
            0,
            audioRef.current.currentTime - 10
          );
          break;
        case "ArrowRight":
          audioRef.current.currentTime = Math.min(
            audioRef.current.duration,
            audioRef.current.currentTime + 10
          );
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audioRef, togglePlayPause]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 7) VOLUME LOGIC
  // ─────────────────────────────────────────────────────────────────────────────
  const toggleVolume = () => {
    dispatch(setIsVolumeVisible(!isVolumeVisible));
  };

  // This function calculates the new volume based on the mouse Y position relative to the blue bar.
  const calculateVolume = (clientY: number, rect: DOMRect) => {
    const mouseY = clientY - rect.top;
    let newVolume = 1 - mouseY / rect.height;
    return Math.max(0, Math.min(1, newVolume));
  };

  // When the user presses down on the volume bar.
  const handleVolumeMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    // Disable text selection and force pointer cursor globally
    document.body.style.userSelect = "none";
    document.body.style.cursor = "pointer";
    if (volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const newVolume = calculateVolume(e.clientY, rect);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      setVolume(newVolume);
    }
    e.preventDefault();
  };

  // Attach a document-level mousemove listener when dragging so volume updates even if outside.
  useEffect(() => {
    if (isDraggingVolume) {
      const handleDocumentMouseMove = (e: globalThis.MouseEvent) => {
        if (volumeBarRef.current) {
          const rect = volumeBarRef.current.getBoundingClientRect();
          const newVolume = calculateVolume(e.clientY, rect);
          if (audioRef.current) {
            audioRef.current.volume = newVolume;
          }
          setVolume(newVolume);
        }
        e.preventDefault();
      };
      document.addEventListener("mousemove", handleDocumentMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleDocumentMouseMove);
      };
    }
  }, [isDraggingVolume, audioRef]);

  // Listen on the document for mouseup to cancel dragging and reset global styles.
  useEffect(() => {
    const handleDocumentMouseUp = (e: globalThis.MouseEvent) => {
      if (isDraggingVolume) {
        setIsDraggingVolume(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };
    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [isDraggingVolume]);

  // Hide volume slider if clicking outside the volume container.
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        volumeContainerRef.current &&
        !volumeContainerRef.current.contains(e.target as Node)
      ) {
        dispatch(setIsVolumeVisible(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  const playPauseButton = isPlaying ? (
    <FontAwesomeIcon icon={faPause} className="text-white" />
  ) : (
    <FontAwesomeIcon icon={faPlay} className="ml-0.5 text-white" />
  );

  const playPauseButtonMobile = isPlaying ? (
    <FontAwesomeIcon icon={faPause} size="lg" className="text-white" />
  ) : (
    <FontAwesomeIcon icon={faPlay} size="lg" className="text-white" />
  );

  return (
    <div>
      {/* DESKTOP PLAYER */}
      <div className="fixed bottom-0 left-0 w-full z-10 hidden md:block">
        <div className="flex w-full h-full items-center justify-center">
          {/* Hidden audio tag */}
          <audio
            className="hidden"
            src={`/api/audio/${currentTrack?.file || ""}`}
            ref={audioRef}
            autoPlay={isPlaying}
            onEnded={() => dispatch(setIsPlaying(false))}
            onPause={() => dispatch(setIsPlaying(false))}
            onPlay={() => dispatch(setIsPlaying(true))}
            onTimeUpdate={handleTimeUpdate}
            preload="auto"
          />
        </div>

        <div className="flex flex-row items-center justify-center w-full h-20 border-t dark:border-neutral-800 bg-white dark:bg-transparent border-neutral-300 backdrop-blur-md px-6">
          {/* Navigation Buttons */}
          <div className="flex flex-row w-32 md:w-48 h-full items-center justify-center">
            <div className="items-center mr-4 p-2">
              <FontAwesomeIcon
                icon={faBackwardStep}
                size="lg"
                onClick={previousTrack}
                className="cursor-pointer hover:opacity-75 text-neutral-800 dark:text-white"
              />
            </div>
            {/* Play/Pause Button */}
            <button
              className="flex bg-neutral-800 dark:bg-blue-600 rounded-full w-10 h-10 items-center justify-center user-select-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              <div className="cursor-pointer hover:opacity-75 text-neutral-800 dark:text-white">
                {playPauseButton}
              </div>
            </button>
            <div className="items-center p-2 ml-4">
              <FontAwesomeIcon
                icon={faForwardStep}
                size="lg"
                onClick={nextTrack}
                className="cursor-pointer hover:opacity-75 text-neutral-800 dark:text-white"
              />
            </div>
            <button className="items-center p-2 ml-4 text-neutral-400 dark:text-white cursor-pointer">
              <FontAwesomeIcon
                icon={faRepeat}
                size="sm"
                onClick={loopTrack}
                className={`cursor-pointer hover:opacity-75 ${
                  isLoopEnabled
                    ? "text-blue-500"
                    : "text-neutral-600 dark:text-white"
                }`}
              />
            </button>
          </div>

          {/* Waveform & Timestamp */}
          <div className="flex flex-row w-1/2 h-full items-center px-4">
            <div ref={waveformContainerRef} className="w-full">
              {currentTrack?.file ? (
                <Waveform
                  audioUrl={`/api/audio/${currentTrack.file}`}
                  audioRef={audioRef}
                  amplitude={0.5}
                  currentTime={audioRef.current?.currentTime || 0}
                  trackDuration={audioRef.current?.duration || 0}
                  width={waveformWidth}
                  updateCurrentTime={(newTime: number) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = newTime;
                    }
                  }}
                />
              ) : (
                <p />
              )}
            </div>
            {/* Timestamp */}
            <div className="hidden lg:flex text-xs mx-2 w-28 h-full items-center justify-center user-select-none">
              <p className="text-neutral-600 dark:text-white">
                {formatTime(audioRef.current?.currentTime)}
                <span className="text-transparent"> / </span>
                <span className="text-neutral-500">
                  {formatTime(trackDuration)}
                </span>{" "}
              </p>
            </div>

            {/* Volume Icon & Slider */}
            <div
              ref={volumeContainerRef}
              className="relative flex justify-center md:mx-4 lg:mx-1"
            >
              <button onClick={toggleVolume}>
                <div className="cursor-pointer">
                  <FontAwesomeIcon
                    icon={faVolumeLow}
                    size="lg"
                    className="cursor-pointer hover:opacity-75 text-neutral-800 dark:text-white"
                  />
                </div>
              </button>
              {isVolumeVisible && (
                <div
                  onMouseDown={handleVolumeMouseDown}
                  className="volume-bar select-none cursor-pointer bg-neutral-50 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 h-28 w-6 rounded-full absolute bottom-10 right-[-3px] transform z-10 flex justify-center items-center"
                >
                  {/* Use volumeBarRef on the blue bar container */}
                  <div
                    ref={volumeBarRef}
                    className="bg-blue-600 rounded-lg h-20 w-1 cursor-pointer relative"
                  >
                    {/* Gray area above the volume level */}
                    <div
                      className="bg-neutral-200 dark:bg-neutral-500 rounded-lg w-1"
                      style={{ height: `${(1 - volume) * 100}%` }}
                    />
                    {/* Volume handle (circle) */}
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
          <div className="flex items-center h-full md:w-80 lg:w-100">
            {/* Album Art */}
            <div className="relative h-12 w-12 lg:h-16 lg:w-16 dark:bg-black/70 bg-neutral-90/70 rounded-md ml-2">
              <div className="flex items-center justify-center h-12 w-12 lg:h-16 lg:w-16 ml-0 rounded-md p-0.5 md:p-0.5">
                <Image
                  src={`https://blendtune-public.nyc3.digitaloceanspaces.com/artwork/${
                    currentTrack?.metadata?.catalog ?? "default"
                  }.jpg`}
                  alt={currentTrack?.metadata?.title ?? ""}
                  className="w-full h-full object-cover rounded-md shadow-md cursor-pointer hover:opacity-75"
                  width={64}
                  height={64}
                  priority
                />
              </div>
            </div>
            {/* Track Metadata */}
            <div className="flex flex-col justify-center items-left p-4 w-40 lg:w-60 h-full">
              <div className="flex flex-col justify-left items-left">
                <button
                  className="items-start justify-start cursor-pointer"
                  onClick={openTrackInfo}
                >
                  <p className="flex items-start justify-start text-left text-neutral-600 dark:text-neutral-200 text-sm font-semibold mb-1">
                    {currentTrack?.metadata?.title.toUpperCase()} [
                    {currentTrack?.info?.mood[1]},{" "}
                    {currentTrack?.info?.relatedartist[0]}]
                  </p>
                </button>
              </div>
              <div className="flex items-left flex-row justify-left m-0 p-0 mr-auto">
                <p className="flex items-center text-2xs text-neutral-500 dark:text-white px-2 mr-1 border border-neutral-500 dark:border-neutral-500 rounded-md cursor-default">
                  {currentTrack?.info?.key?.note}{" "}
                  {currentTrack?.info?.key?.scale.substring(0, 3).toLowerCase()}
                </p>
                <p className="flex justify-center items-center text-2xs text-neutral-500 dark:text-neutral-600 mr-1 bg-transparent dark:bg-neutral-500 rounded-md w-12 cursor-default border border-neutral-500 dark:border-transparent">
                  {currentTrack?.info?.bpm} BPM
                </p>
                <p className="hidden lg:flex justify-center items-center text-2xs bg-blue-600 dark:bg-blue-600 text-white rounded-md w-16 cursor-default">
                  {currentTrack?.info?.genre[0]?.maingenre}
                </p>
              </div>
            </div>
            {/* Song Buttons */}
            <div className="flex flex-row justify-center items-center w-16 lg:w-28 h-full">
              <div className="flex items-center justify-center mx-auto bg-neutral-100 dark:bg-black p-2 rounded-full relative cursor-pointer hover:opacity-75">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-neutral-500 dark:text-white"
                />
              </div>
              <div className="ml-2 flex items-center justify-center mx-auto bg-neutral-100 dark:bg-black p-2 rounded-full relative cursor-pointer hover:opacity-75">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-neutral-500 dark:text-white"
                />
              </div>
              <div className="ml-2 flex items-center justify-center mx-auto bg-neutral-100 dark:bg-black p-2 px-3.5 rounded-full relative cursor-pointer hover:opacity-75">
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="text-neutral-500 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PLAYER */}
      <div className="fixed px-3 rounded-lg bottom-4 w-full h-18 z-0 block md:hidden">
        <div className="border dark:border-neutral-800 flex flex-col justify-center items-center w-full rounded-lg border-neutral-200 bg-neutral-100/90 dark:bg-black/90 overflow-hidden h-full backdrop-blur-md">
          {/* Seek bar for mobile */}
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
                className="bg-black dark:bg-blue-600 h-1 rounded-md shadow-md w-full transition-width duration-100 ease-in-out"
                style={{
                  width: `${
                    ((currentTime || 0) / (audioRef.current?.duration || 1)) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-center items-center w-full h-full">
            {/* Mobile Artwork */}
            <div className="flex items-center justify-center w-28 h-auto">
              <Image
                src={`https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${
                  currentTrack?.metadata?.catalog ?? "default"
                }.jpg`}
                alt={currentTrack?.metadata?.title ?? ""}
                className="h-full object-cover shadow-md"
                width={70}
                height={70}
              />
            </div>
            {/* Mobile Track Info */}
            <div className="flex flex-col items-start justify-start ml-3 w-full h-full">
              <div className="mb-1">
                <button
                  className="items-start justify-start cursor-pointer"
                  onClick={openTrackInfo}
                >
                  <p className="flex items-start justify-start text-left text-neutral-800 dark:text-neutral-200 text-sm font-semibold mb-1">
                    {currentTrack?.metadata?.title.toUpperCase()} [
                    {currentTrack?.info?.mood[1]}, {currentTrack?.info?.relatedartist[0]}]
                  </p>
                </button>
              </div>
              <div className="flex mt-0.5">
                <p className="text-2xs border-neutral-800 text-white px-2 mr-1 bg-blue-400 dark:bg-blue-500 rounded-md">
                  {currentTrack?.info?.key?.note}
                  {currentTrack?.info?.key?.scale.substring(0, 3)}
                </p>
                <p className="text-2xs text-white mr-1 bg-blue-500 dark:bg-blue-700 px-2 rounded-md">
                  {currentTrack?.info?.bpm}BPM
                </p>
                <p className="text-2xs text-white mr-1 bg-purple-500 dark:bg-purple-700 px-2 rounded-md">
                  {currentTrack?.info?.genre[0]?.maingenre}
                </p>
              </div>
            </div>
            {/* Mobile Controls */}
            <div className="flex flex-row justify-center items-center h-full w-24 pr-8">
              <div className="items-center mr-2 p-2">
                <FontAwesomeIcon
                  icon={faBackwardStep}
                  size="sm"
                  onClick={previousTrack}
                  className="cursor-pointer hover:opacity-75 text-neutral-800 dark:text-white"
                />
              </div>
              <button
                className="flex rounded-full w-10 h-10 items-center justify-center user-select-none bg-neutral-800 dark:bg-blue-700 p-4"
                onClick={togglePlayPause}
              >
                <div className="cursor-pointer hover:opacity-75 text-white dark:text-neutral-600">
                  {playPauseButtonMobile}
                </div>
              </button>
              <div className="items-center p-2 ml-2">
                <FontAwesomeIcon
                  icon={faForwardStep}
                  size="sm"
                  onClick={nextTrack}
                  className="cursor-pointer hover:opacity-75 text-neutral-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
