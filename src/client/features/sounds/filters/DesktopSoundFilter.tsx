// src\client\features\sounds\filters\DesktopSoundFilter.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Track } from "@/shared/types/track";
import {
  GenreFilter,
  TempoFilter,
  KeyFilter,
  ArtistFilter,
  InstrumentFilter,
  MoodFilter,
  KeywordFilter,
  SortFilter,
} from "./components";

import { useDispatch } from "react-redux";
import {
  removeAllKeywords,
  removeAllGenres,
} from "@store/slices";
import { uniqueArtists, uniqueMoods, uniqueKeywords } from "@tracks/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

/* 
   PROPS: Mirror whatever your original SoundFilter required. 
   For clarity, they're kept similar to your existing code.
*/
interface DesktopSoundFilterProps {
  tracks: Track[];

  minTempo: number;
  setMinTempo: (val: number) => void;
  maxTempo: number;
  setMaxTempo: (val: number) => void;
  includeHalfTime: boolean;
  setIncludeHalfTime: (val: boolean) => void;
  includeDoubleTime: boolean;
  setIncludeDoubleTime: (val: boolean) => void;

  setKeyFilterCombinations: React.Dispatch<
    React.SetStateAction<
      {
        key: string | null;
        "key.note": string | null;
        "key.scale": string | null;
      }[]
    >
  >;
  selectedKeys: string;
  setSelectedKeys(selectedKeys: string): void;
  selectedScale: string;
  setSelectedScale(selectedScale: string): void;

  selectedGenres: string[];

  selectedArtists: string[];
  setSelectedArtists: (artists: string[]) => void;

  selectedInstruments: string[];
  setSelectedInstruments: (instruments: string[]) => void;

  selectedMoods: string[];
  setSelectedMoods: (moods: string[]) => void;

  selectedKeywords: string[];

  sortBy: string | null;
  handleSortChange: (option: string) => void;
}

const DesktopSoundFilter: React.FC<DesktopSoundFilterProps> = ({
  tracks,

  minTempo,
  setMinTempo,
  maxTempo,
  setMaxTempo,
  includeHalfTime,
  setIncludeHalfTime,
  includeDoubleTime,
  setIncludeDoubleTime,

  setKeyFilterCombinations,
  selectedKeys,
  setSelectedKeys,
  selectedScale,
  setSelectedScale,

  selectedGenres,

  selectedArtists,
  setSelectedArtists,

  selectedInstruments,
  setSelectedInstruments,

  selectedMoods,
  setSelectedMoods,

  selectedKeywords,

  sortBy,
  handleSortChange,
}) => {
  const dispatch = useDispatch();

  /** Generate unique list of artists, moods, keywords, etc. */
  const [artistList, setArtistList] = useState<string[]>([]);
  const [moodList, setMoodList] = useState<string[]>([]);
  const [keywordList, setKeywordList] = useState<string[]>([]);

  useEffect(() => {
    setArtistList(uniqueArtists(tracks));
    setMoodList(uniqueMoods(tracks));
    setKeywordList(uniqueKeywords(tracks));
  }, [tracks]);

  /** Tracking which filter is open (Tempo, Key, Genre, etc.) */
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState(false);

  /** Toggle specific filter (shows/hides its dropdown) */
  const toggleFilter = (filterName: string) => {
    if (filterName === "Instrument") return;
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  /** Sorting dropdown logic */
  const sortButtonRef = useRef<HTMLDivElement | null>(null);
  const toggleSortFilter = () => setOpenSortFilter(!openSortFilter);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setOpenSortFilter(false);
      }
    }
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  /** Determine if any filter is applied */
  const hasItems = (item: string | string[]) => {
    if (typeof item === "string") {
      return item.trim() !== "";
    } else if (Array.isArray(item)) {
      return item.length > 0;
    }
    return false;
  };

  const filtersApplied =
    minTempo > 40 ||
    maxTempo < 200 ||
    hasItems(selectedKeys) ||
    hasItems(selectedGenres) ||
    hasItems(selectedArtists) ||
    hasItems(selectedInstruments) ||
    hasItems(selectedMoods) ||
    hasItems(selectedKeywords);

  /** Clear all filters */
  const handleClearClick = () => {
    setMinTempo(40);
    setMaxTempo(200);
    setIncludeHalfTime(false);
    setIncludeDoubleTime(false);
    setSelectedKeys("");
    setKeyFilterCombinations([]);
    setSelectedArtists([]);
    setSelectedInstruments([]);
    setSelectedMoods([]);
    dispatch(removeAllGenres());
    dispatch(removeAllKeywords());
    setOpenFilter(null);
  };

  /** Utility to style each filter button based on whether it’s active */
  const getFilterButtonClass = (
    name: string,
    openFilterName: string | null,
    selectedValue: string | string[]
  ) => {
    let baseClasses = "flex flex-row px-3 py-1.5 text-2xs rounded-lg border transition-colors duration-150 bg-transparent text-neutral-600 dark:text-neutral-300 ";
  
    // Check if filter is active based on the actual filter state
    const isActive = (() => {
      switch (name) {
        case "Tempo":
          return minTempo > 40 || maxTempo < 200;
        case "Key":
          return selectedKeys !== "" && selectedScale !== "";
        case "Genre":
          return selectedGenres.length > 0;
        case "Artist":
          return selectedArtists.length > 0;
        case "Instrument":
          return selectedInstruments.length > 0;
        case "Mood":
          return selectedMoods.length > 0;
        case "Keyword":
          return selectedKeywords.length > 0;
        default:
          return false;
      }
    })();
  
  
    // Apply border color based on state
    if (isActive) {
      return baseClasses + "border-blue-500 dark:border-blue-500";
    }
  
    // Default border style based on open state
    if (openFilterName === name) {
      return baseClasses + "border-[#D5D5D5] hover:border-neutral-300 dark:border-neutral-200 shadow-md dark:hover:border-neutral-200";
    }
  
    return baseClasses + "border-neutral-400 hover:border-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500";
  };

  /** Helper to display short text for the filter if selected. E.g., BPM range or first selected genre. */
  const renderFilterLabel = (filterName: string): string => {
    switch (filterName) {
      case "Key":
        return selectedKeys && selectedScale 
          ? `${selectedKeys} ${selectedScale.toLowerCase()}`
          : "";
  
      case "Genre":
        if (selectedGenres.length === 0) return "";
        return selectedGenres.length === 1 
          ? selectedGenres[0]
          : `${selectedGenres[0]} +${selectedGenres.length - 1}`;
  
      case "Artist":
        if (selectedArtists.length === 0) return "";
        return selectedArtists.length === 1
          ? selectedArtists[0]
          : `${selectedArtists[0]} +${selectedArtists.length - 1}`;
  
      case "Instrument":
        if (selectedInstruments.length === 0) return "";
        return selectedInstruments.length === 1
          ? selectedInstruments[0]
          : `${selectedInstruments[0]} +${selectedInstruments.length - 1}`;
  
      case "Mood":
        if (selectedMoods.length === 0) return "";
        return selectedMoods.length === 1
          ? selectedMoods[0]
          : `${selectedMoods[0]} +${selectedMoods.length - 1}`;
  
      case "Keyword":
        if (selectedKeywords.length === 0) return "";
        return selectedKeywords.length === 1
          ? selectedKeywords[0]
          : `${selectedKeywords[0]} +${selectedKeywords.length - 1}`;
  
      default:
        return "";
    }
  };

  /** All your desktop filter “buttons” and their dropdowns. */
  const filterButtons = [
    { name: "Genre", component: <GenreFilter selectedGenres={selectedGenres} onClose={() => toggleFilter("Genre")} /> },
    {
      name: "Tempo",
      component: (
        <TempoFilter
          minTempo={minTempo}
          setMinTempo={setMinTempo}
          maxTempo={maxTempo}
          setMaxTempo={setMaxTempo}
          includeHalfTime={includeHalfTime}
          setIncludeHalfTime={setIncludeHalfTime}
          includeDoubleTime={includeDoubleTime}
          setIncludeDoubleTime={setIncludeDoubleTime}
          onClose={() => toggleFilter("Tempo")}
        />
      ),
    },
    {
      name: "Key",
      component: (
        <KeyFilter
          setKeyFilterCombinations={setKeyFilterCombinations}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          selectedScale={selectedScale}
          setSelectedScale={setSelectedScale}
          onClose={() => toggleFilter("Key")}
        />
      ),
    },
    {
      name: "Artist",
      component: (
        <ArtistFilter
          artists={artistList}
          selectedArtists={selectedArtists}
          setSelectedArtists={setSelectedArtists}
          onClose={() => toggleFilter("Artist")}
        />
      ),
    },
    {
      name: "Instrument",
      component: (
        <InstrumentFilter
          selectedInstruments={selectedInstruments}
          setSelectedInstruments={setSelectedInstruments}
          onClose={() => toggleFilter("Instrument")}
        />
      ),
    },
    {
      name: "Mood",
      component: (
        <MoodFilter
          moods={moodList}
          selectedMoods={selectedMoods}
          setSelectedMoods={setSelectedMoods}
          onClose={() => toggleFilter("Mood")}
        />
      ),
    },
    {
      name: "Keyword",
      component: (
        <KeywordFilter
          keywords={keywordList}
          selectedKeywords={selectedKeywords}
          onClose={() => toggleFilter("Keyword")}
        />
      ),
    },
  ];

  return (
    // Hide on mobile, show on md+ screens:
    <div className="hidden md:block w-full border-neutral-600 bg-white dark:bg-neutral-950 sticky top-0 py-2 z-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-row justify-between items-center w-full">
          {/* LEFT: Filter Buttons */}
          <div className="flex flex-row items-center">
          {filterButtons.map((f) => {
            const isOpen = openFilter === f.name;
            const label = renderFilterLabel(f.name);
            const buttonClass = getFilterButtonClass(f.name, openFilter, f.name); // Changed this line
            return (
              <div className="mr-2 relative" key={f.name}>
                <button className={buttonClass} onClick={() => toggleFilter(f.name)}>                    {/** Button text + dynamic label */}
                    <p className="mr-1.5">
                      {f.name}
                      {label && (
                        <>
                          : <span className="font-semibold">{label}</span>
                        </>
                      )}
                    </p>
                    <FontAwesomeIcon
                      icon={f.name === "Keyword" ? (isOpen ? faMinus : faPlus) : isOpen ? faChevronUp : faChevronDown}
                      size="2xs"
                      className="mt-1"
                    />
                  </button>

                  {/** The dropdown filter itself, if openFilter === f.name */}
                  {isOpen && (
                    <div className="absolute left-0 mt-2 z-50 min-w-[240px]">
                      {f.component}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Clear all if any filter is applied */}
            {filtersApplied && (
              <button
                className="px-2 py-1.5 text-2xs rounded-lg text-[#707070] dark:text-neutral-300"
                onClick={handleClearClick}
              >
                Clear all
              </button>
            )}
          </div>

          {/* RIGHT: Sort Filter */}
          <div ref={sortButtonRef} className="relative">
            <button
              className="flex flex-row py-1.5 px-4 bg-transparent border rounded-full border-neutral-400 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500 text-neutral-600 dark:text-neutral-300"
              onClick={toggleSortFilter}
            >
              <span className="text-2xs mr-1.5">Sort by:</span>
              <span className="text-2xs mr-1.5">{sortBy}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                size="2xs"
                className="cursor-pointer mt-0.5"
              />
            </button>

            {openSortFilter && (
              <div className="absolute right-0 mt-2 z-50">
                <SortFilter
                  openSortFilter={openSortFilter}
                  sortBy={sortBy}
                  handleSortChange={handleSortChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSoundFilter;
