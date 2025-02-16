"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "@/client/environment/services/audioService";
import { useTracks } from "@/client/environment/services/trackService";
import {
  setCurrentTrack,
  setIsPlaying,
} from "@/client/environment/redux/slices/playback";
import { RootState } from "@/client/environment/redux/store";
import {
  Hero,
  Category,
  MobileCatalog,
  DesktopCatalog,
  DesktopSoundFilter,
  MobileSoundFilter,
  NewTracks,
} from "@/client/ui/pages/sounds";
import {
  tempoFilter,
  keyFilter,
  categoryFilter,
  genreFilter,
  artistFilter,
  instrumentFilter,
  moodFilter,
  keywordFilter,
} from "@/client/utils/helpers/filters";
import { Track } from "@/shared/types/track";
import { useRightSidebar } from "@/client/utils/context/RightSidebarContext";

const Sounds: React.FC = () => {
  // Call all hooks unconditionally.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dispatch = useDispatch();
  const { audioRef } = useAudio();
  const { tracks } = useTracks();

  const currentTrack = useSelector(
    (state: RootState) => state.audio.playback.currentTrack as Track | undefined
  );
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );

  // Get sidebar controls from context.
  const { showSidebar, userClosed } = useRightSidebar();

  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false); // Throttle rapid clicks

  // Toggle play/pause with throttling and error handling.
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
          if (error.name === "AbortError") {
            console.warn("Play request aborted due to rapid clicking.");
          } else {
            console.error("Error playing the track:", error);
          }
        });
      dispatch(setIsPlaying(true));
    }
  }, [audioRef, isPlaying, dispatch, isTransitioning]);

  // Play a track (or toggle if same track) with throttling and error handling.
  const playTrack = useCallback(
    (selectedTrack: Track) => {
      if (!audioRef.current || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);

      if (currentTrack && selectedTrack.id === currentTrack.id) {
        if (isPlaying) {
          audioRef.current.pause();
          dispatch(setIsPlaying(false));
        } else {
          audioRef.current
            .play()
            .catch((error) => {
              if (error.name === "AbortError") {
                console.warn("Play request aborted due to rapid clicking.");
              } else {
                console.error("Error playing the track:", error);
              }
            });
          dispatch(setIsPlaying(true));
        }
      } else {
        dispatch(setCurrentTrack(selectedTrack));
        const audioElement = audioRef.current;
        if (audioElement) {
          audioElement.src = `/audio/tracks/${selectedTrack.file}`;
          audioElement.addEventListener(
            "loadeddata",
            () => {
              audioElement
                .play()
                .catch((error) => {
                  if (error.name === "AbortError") {
                    console.warn("Play request aborted due to rapid clicking.");
                  } else {
                    console.error("Error playing the track:", error);
                  }
                });
              dispatch(setIsPlaying(true));
            },
            { once: true }
          );
          audioElement.load();
        }
      }
      // Force–open the sidebar if the user hasn't permanently closed it.
      if (!userClosed) {
        showSidebar();
      }
    },
    [currentTrack, isPlaying, dispatch, audioRef, showSidebar, userClosed, isTransitioning]
  );

  // When a track title is clicked, force–open the sidebar and play the track.
  const handleTitleClick = useCallback(
    (selectedTrack: Track) => {
      if (!userClosed) {
        showSidebar(); // This resets any close counter.
      }
      playTrack(selectedTrack);
    },
    [playTrack, showSidebar, userClosed]
  );

  // FILTER CONTROLS
  const selectedGenres = useSelector(
    (state: RootState) => state.tracks.selected.genres
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.selected.category
  );

  const [minTempo, setMinTempo] = useState(40);
  const [maxTempo, setMaxTempo] = useState(200);
  const [includeHalfTime, setIncludeHalfTime] = useState(false);
  const [includeDoubleTime, setIncludeDoubleTime] = useState(false);

  const [selectedKeys, setSelectedKeys] = useState<string>("");
  const [selectedScale, setSelectedScale] = useState<string>("Major");
  const [keyFilterCombinations, setKeyFilterCombinations] = useState<
    Array<{ key: string | null; "key.note": string | null; "key.scale": string | null; }>
  >([]);

  const selectedKeywords = useSelector(
    (state: RootState) => state.tracks.selected.keywords
  );

  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const applyAllFilters = useCallback(() => {
    const categoryFiltered = tracks.filter((track) =>
      categoryFilter(track, selectedCategory)
    );

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

  useEffect(() => {
    applyAllFilters();
  }, [tracks, applyAllFilters]);

  const [sortBy, setSortBy] = useState<string | null>("Newest");

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

  // Now render conditionally based on mounting status.
  return isMounted ? (
    <div className="flex flex-col h-full w-full">
      <div className="md:h-full overflow-y-scroll rounded-t-xl">
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
        <Hero
          audioRef={audioRef}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
        />
        <Category />
        <NewTracks
          tracks={tracks}
          playTrack={playTrack}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
        />
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
        <DesktopCatalog
          tracks={filteredTracks}
          playTrack={playTrack}
          onTitleClick={handleTitleClick}
        />
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
