// src/app/sounds/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "@player/hooks";
import { useTracks } from "@sounds/tracks/hooks";
import {
  setCurrentTrack,
  setIsPlaying,
  setTrackList,
} from "@store/slices";
import { RootState } from "@core/store";
import { Hero } from "@sounds/hero";
import { Category } from "@sounds/category/components";
import { MobileCatalog, DesktopCatalog, NewTracks } from "@sounds/tracks/components";
import { DesktopSoundFilter, MobileSoundFilter } from "@/client/features/sounds/filters/category";
import {
  tempoFilter,
  keyFilter,
  categoryFilter,
  genreFilter,
  artistFilter,
  instrumentFilter,
  moodFilter,
  keywordFilter,
} from "@sounds/filters/utils/filters";
import { Track } from "@/shared/types/track";
import { useRightSidebar } from "@layout/rightbar/context";

/**
 * Sounds Component:
 * - Manages the audio playback and filtering system.
 * - Handles UI interactions for track selection and filtering.
 */
const Sounds: React.FC = () => {
  // Local state for mounting and track filtering
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dispatch = useDispatch();
  const { audioRef } = useAudio();
  const { tracks } = useTracks();

  // Global state from Redux for current track and playback status
  const currentTrack = useSelector(
    (state: RootState) => state.audio.playback.currentTrack as Track | undefined
  );
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );

  // Sidebar state control
  const { openSidebar, userClosedSidebar } = useRightSidebar();

  // Local state to manage filtered tracks and play/pause throttling
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Toggles play/pause state while preventing rapid clicking.
   */
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);

    if (isPlaying) {
      audioRef.current.pause();
      dispatch(setIsPlaying(false));
    } else {
      audioRef.current
        .play()
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing the track:", error);
          }
        });
      dispatch(setIsPlaying(true));
    }
  }, [audioRef, isPlaying, dispatch, isTransitioning]);

  /**
   * Handles track playback.
   * - If the same track is selected, toggles play/pause.
   * - Otherwise, loads and plays the new track.
   */
  const playTrack = useCallback(
    (selectedTrack: Track) => {
      if (!audioRef.current || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 100);

      if (currentTrack && selectedTrack.id === currentTrack.id) {
        togglePlayPause();
      } else {
        dispatch(setCurrentTrack(selectedTrack));
        const audioElement = audioRef.current;
        if (audioElement) {
          audioElement.src = `/audio/tracks/${selectedTrack.file}`;
          audioElement.addEventListener(
            "loadeddata",
            () => {
              audioElement.play().catch(console.error);
              dispatch(setIsPlaying(true));
            },
            { once: true }
          );
          audioElement.load();
        }
      }

      // Open sidebar when track is played unless explicitly closed
      if (!userClosedSidebar) {
        openSidebar();
      }
    },
    [currentTrack, dispatch, audioRef, openSidebar, userClosedSidebar, isTransitioning, togglePlayPause]
  );

  /**
   * Opens sidebar and plays a track when its title is clicked.
   */
  const handleTitleClick = useCallback(
    (selectedTrack: Track) => {
      if (!userClosedSidebar) {
        openSidebar();
      }
      playTrack(selectedTrack);
    },
    [playTrack, openSidebar, userClosedSidebar]
  );

  /**
   * FILTER CONTROLS:
   * - Manages track filtering based on user-selected criteria.
   * - Uses Redux state for global filter selections.
   */
  const selectedGenres = useSelector(
    (state: RootState) => state.tracks.selected.genres
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.selected.category
  );

  // State for tempo filtering (BPM range)
  const [minTempo, setMinTempo] = useState(40);
  const [maxTempo, setMaxTempo] = useState(200);
  const [includeHalfTime, setIncludeHalfTime] = useState(false);
  const [includeDoubleTime, setIncludeDoubleTime] = useState(false);

  // State for key selection in filtering
  const [selectedKeys, setSelectedKeys] = useState<string>("");
  const [selectedScale, setSelectedScale] = useState<string>("Major");
  const [keyFilterCombinations, setKeyFilterCombinations] = useState<
    Array<{ key: string | null; "key.note": string | null; "key.scale": string | null }>
  >([]);

  // Redux state for additional filters
  const selectedKeywords = useSelector(
    (state: RootState) => state.tracks.selected.keywords
  );

  // State for filtering by artist, instrument, and mood
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  /**
   * Filters tracks based on selected criteria.
   * - Category, tempo, key, genre, artist, instrument, mood, and keyword filters.
   * - Updates the `filteredTracks` state after applying filters.
   */
  const applyAllFilters = useCallback(() => {
    // Filter by category first
    const categoryFiltered = tracks.filter((track) =>
      categoryFilter(track, selectedCategory)
    );

    // Apply remaining filters
    const filtered = categoryFiltered.filter((track) => {
      const tempoPass = tempoFilter(
        track,
        minTempo,
        maxTempo,
        includeHalfTime,
        includeDoubleTime
      );
      const keyPass = keyFilter(track, keyFilterCombinations);
      const genrePass = genreFilter(track, selectedGenres);
      const artistPass = artistFilter(track, selectedArtists);
      const instrumentPass = instrumentFilter(track, selectedInstruments);
      const moodPass = moodFilter(track, selectedMoods);
      const keywordPass = keywordFilter(track, selectedKeywords);

      return (
        tempoPass &&
        keyPass &&
        genrePass &&
        artistPass &&
        instrumentPass &&
        moodPass &&
        keywordPass
      );
    });

    setFilteredTracks(filtered);
  }, [
    tracks,
    selectedCategory,
    minTempo,
    maxTempo,
    includeHalfTime,
    includeDoubleTime,
    keyFilterCombinations,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
  ]);

  // Reapply filters whenever the track list or filter criteria change
  useEffect(() => {
    applyAllFilters();
  }, [tracks, applyAllFilters]);

  /**
   * SORTING LOGIC:
   * - Handles sorting of tracks by newest, oldest, or alphabetical order.
   */
  const [sortBy, setSortBy] = useState<string | null>("Newest");

  /**
   * Shuffles an array randomly using Fisher-Yates algorithm.
   */
  function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  /**
   * Sorting criteria for tracks.
   */
  const sortByCriteria = useMemo(
    () => ({
      Newest: (a: Track, b: Track) =>
        b.metadata.release.localeCompare(a.metadata.release),
      Oldest: (a: Track, b: Track) =>
        a.metadata.release.localeCompare(b.metadata.release),
      "A-Z": (a: Track, b: Track) =>
        a.metadata.title.localeCompare(b.metadata.title, undefined, {
          sensitivity: "base",
        }),
    }),
    []
  );

  /**
   * Handles sorting when a new sort option is selected.
   */
  const handleSortChange = useCallback(
    (option: string) => {
      setSortBy(option);
      const sortedTracks = [...filteredTracks];
      if (option === "Random") {
        shuffleArray(sortedTracks);
      } else {
        sortedTracks.sort(sortByCriteria[option as keyof typeof sortByCriteria]);
      }
      setFilteredTracks(sortedTracks);
    },
    [filteredTracks, sortByCriteria]
  );

  // Dispatch sorted track list to global state
  useEffect(() => {
    if (filteredTracks.length > 0) {
      dispatch(setTrackList(filteredTracks));
    }
  }, [filteredTracks, dispatch]);


    /**
   * Renders the UI components only after mounting.
   * Ensures the app does not interact with the DOM before hydration.
   */
    return isMounted ? (
      <div className="flex flex-col h-full w-full">
        <div className="md:h-full overflow-y-scroll rounded-t-xl">
          {/* Mobile filter component */}
          <MobileSoundFilter
            tracks={tracks}
            minTempo={minTempo}
            setMinTempo={setMinTempo}
            maxTempo={maxTempo}
            setMaxTempo={setMaxTempo}
            includeHalfTime={includeHalfTime}
            setIncludeHalfTime={setIncludeHalfTime}
            includeDoubleTime={includeDoubleTime}
            setIncludeDoubleTime={setIncludeDoubleTime}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            selectedScale={selectedScale}
            setSelectedScale={setSelectedScale}
            setKeyFilterCombinations={setKeyFilterCombinations}
            selectedGenres={selectedGenres}
            selectedArtists={selectedArtists}
            setSelectedArtists={setSelectedArtists}
            selectedInstruments={selectedInstruments}
            setSelectedInstruments={setSelectedInstruments}
            selectedMoods={selectedMoods}
            setSelectedMoods={setSelectedMoods}
            selectedKeywords={selectedKeywords}
            sortBy={sortBy}
            handleSortChange={handleSortChange}
          />
  
          {/* Hero section: controls main playback */}
          <Hero
            audioRef={audioRef}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
          />
  
          {/* Category selector */}
          <Category />
  
          {/* Display new tracks */}
          <NewTracks
            tracks={tracks}
            playTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
  
          {/* Desktop filter component */}
          <DesktopSoundFilter
            tracks={tracks}
            minTempo={minTempo}
            setMinTempo={setMinTempo}
            maxTempo={maxTempo}
            setMaxTempo={setMaxTempo}
            includeHalfTime={includeHalfTime}
            setIncludeHalfTime={setIncludeHalfTime}
            includeDoubleTime={includeDoubleTime}
            setIncludeDoubleTime={setIncludeDoubleTime}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            selectedScale={selectedScale}
            setSelectedScale={setSelectedScale}
            setKeyFilterCombinations={setKeyFilterCombinations}
            selectedGenres={selectedGenres}
            selectedArtists={selectedArtists}
            setSelectedArtists={setSelectedArtists}
            selectedInstruments={selectedInstruments}
            setSelectedInstruments={setSelectedInstruments}
            selectedMoods={selectedMoods}
            setSelectedMoods={setSelectedMoods}
            selectedKeywords={selectedKeywords}
            sortBy={sortBy}
            handleSortChange={handleSortChange}
          />
  
          {/* Desktop track catalog */}
          <DesktopCatalog
            tracks={filteredTracks}
            playTrack={playTrack}
            onTitleClick={handleTitleClick}
          />
  
          {/* Mobile track catalog */}
          <MobileCatalog
            tracks={filteredTracks}
            playTrack={playTrack}
            onTitleClick={handleTitleClick}
          />
        </div>
      </div>
    ) : (
      <></>
    );
  };
  
  export default Sounds;
  