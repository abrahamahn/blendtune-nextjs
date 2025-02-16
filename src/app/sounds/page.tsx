"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAudio } from "@/client/environment/services/audioService";
import { useTracks } from "@/client/environment/services/trackService";

import {
  setCurrentTrack,
  setIsPlaying,
  setTrackInfo,
} from "@/client/environment/redux/slices/playback";
import { RootState } from "@/client/environment/redux/store";
import {
  Hero,
  Category,
  MobileCatalog,
  DesktopCatalog,
  DesktopSoundFilter,
  MobileSoundFilter,
  TrackInfo,
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

const Sounds: React.FC = () => {
  const dispatch = useDispatch();

  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const { audioRef } = useAudio();
  const { tracks } = useTracks();

  const currentTrack = useSelector(
    (state: RootState) => state.audio.playback.currentTrack as Track | undefined
  );
  const isPlaying = useSelector(
    (state: RootState) => state.audio.playback.isPlaying
  );
  const trackInfo = useSelector(
    (state: RootState) => state.audio.playback.trackInfo
  );

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 1;
        audioRef.current
          .play()
          .catch((error) => console.error("Error playing the track:", error));
      }
    }
  }, [audioRef, isPlaying]);

  const playTrack = useCallback(
    (selectedTrack: Track) => {
      if (currentTrack && selectedTrack.id === currentTrack.id) {
        if (isPlaying) {
          if (audioRef.current) audioRef.current.pause();
          dispatch(setIsPlaying(false));
        } else {
          if (audioRef.current) {
            audioRef.current
              .play()
              .catch((error) =>
                console.error("Error playing the track:", error)
              );
            dispatch(setIsPlaying(true));
          }
        }
      } else {
        dispatch(setCurrentTrack(selectedTrack));
        if (audioRef.current) {
          audioRef.current.src = `/audio/tracks/${selectedTrack.file}`;
          audioRef.current.addEventListener(
            "loadeddata",
            () => {
              if (audioRef.current) {
                audioRef.current
                  .play()
                  .catch((error) =>
                    console.error("Error playing the track:", error)
                  );
                dispatch(setIsPlaying(true));
              }
            },
            { once: true }
          );
          audioRef.current.load();
        }
      }
    },
    [currentTrack, isPlaying, dispatch, audioRef]
  );

  const openTrackInfo = () => {
    dispatch(setTrackInfo(true));
  };

  const closeTrackInfo = () => {
    dispatch(setTrackInfo(false));
  };

  // FILTERATION CONTROLS

  /* Genre Control */
  const selectedGenres = useSelector(
    (state: RootState) => state.tracks.selected.genres
  );

  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.selected.category
  );

  /* BPM Control */
  const [minTempo, setMinTempo] = useState(40);
  const [maxTempo, setMaxTempo] = useState(200);
  const [includeHalfTime, setIncludeHalfTime] = useState(false);
  const [includeDoubleTime, setIncludeDoubleTime] = useState(false);

  /* Key Control */
  const [selectedKeys, setSelectedKeys] = useState<string>("");
  const [selectedScale, setSelectedScale] = useState<string>("Major");
  const [keyFilterCombinations, setKeyFilterCombinations] = useState<
    Array<{
      key: string | null;
      "key.note": string | null;
      "key.scale": string | null;
    }>
  >([]);

  /* Keyword Control */
  const selectedKeywords = useSelector(
    (state: RootState) => state.tracks.selected.keywords
  );

  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  /* Filter Applications */
  const applyAllFilters = useCallback(() => {
    const categoryFiltered = tracks.filter((track) => {
      const categoryPass = categoryFilter(track, selectedCategory);
      return categoryPass;
    });

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
    minTempo,
    maxTempo,
    includeHalfTime,
    includeDoubleTime,
    keyFilterCombinations,
    selectedCategory,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
  ]);

  useEffect(() => {
    applyAllFilters();
  }, [tracks, applyAllFilters, dispatch]);

  // Sort Functions
  const [sortBy, setSortBy] = useState<string | null>("Newest");

  function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length,
      randomIndex,
      tempValue;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      tempValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = tempValue;
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
        sortedTracks.sort(
          sortByCriteria[option as keyof typeof sortByCriteria]
        );
      }

      setFilteredTracks(sortedTracks);
    },
    [filteredTracks, sortByCriteria]
  );

  return (
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
          openTrackInfo={openTrackInfo}
        />
        <MobileCatalog
          tracks={filteredTracks}
          playTrack={playTrack}
          openTrackInfo={openTrackInfo}
        />
      </div>

      {trackInfo && currentTrack && (
        <TrackInfo
          audioRef={audioRef}
          currentTrack={currentTrack}
          closeTrackInfo={closeTrackInfo}
        />
      )}
    </div>
  );
};

export default Sounds;
