// src/client/features/sounds/filters/DesktopSoundFilter.tsx

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
import { removeAllKeywords, removeAllGenres } from "@store/slices";
import { uniqueArtists, uniqueMoods, uniqueKeywords } from "@tracks/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

/**
 * DesktopSoundFilterProps Interface
 *
 * Defines the expected properties for the DesktopSoundFilter component.
 * This includes all the state variables and handlers needed to manage filtering 
 * options such as tempo, key, genre, artist, instrument, mood, keywords, and sorting.
 */
interface DesktopSoundFilterProps {
  tracks: Track[]; // List of tracks to be filtered.

  // Tempo filter state and handlers.
  minTempo: number;
  setMinTempo: (val: number) => void;
  maxTempo: number;
  setMaxTempo: (val: number) => void;
  includeHalfTime: boolean;
  setIncludeHalfTime: (val: boolean) => void;
  includeDoubleTime: boolean;
  setIncludeDoubleTime: (val: boolean) => void;

  // Key filter state and handlers.
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

  // Genre filter state.
  selectedGenres: string[];

  // Artist filter state and handlers.
  selectedArtists: string[];
  setSelectedArtists: (artists: string[]) => void;

  // Instrument filter state and handlers.
  selectedInstruments: string[];
  setSelectedInstruments: (instruments: string[]) => void;

  // Mood filter state and handlers.
  selectedMoods: string[];
  setSelectedMoods: (moods: string[]) => void;

  // Keyword filter state.
  selectedKeywords: string[];

  // Sorting state and handler.
  sortBy: string | null;
  handleSortChange: (option: string) => void;
}

/**
 * DesktopSoundFilter Component
 *
 * Provides an interactive UI for filtering tracks based on various attributes 
 * including tempo, key, genre, artist, instrument, mood, and keywords.
 * This component is optimized for desktop usage and features a collapsible filter menu.
 */
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

  /** 
   * State variables for unique values extracted from the tracks.
   * Used to populate filtering options for artists, moods, and keywords.
   */
  const [artistList, setArtistList] = useState<string[]>([]);
  const [moodList, setMoodList] = useState<string[]>([]);
  const [keywordList, setKeywordList] = useState<string[]>([]);

  /**
   * Extracts unique values from the tracks whenever the track list changes.
   */
  useEffect(() => {
    setArtistList(uniqueArtists(tracks));
    setMoodList(uniqueMoods(tracks));
    setKeywordList(uniqueKeywords(tracks));
  }, [tracks]);

  /** 
   * State to track which filter dropdown is currently open.
   * Can be "Tempo", "Key", "Genre", etc.
   */
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState(false);

  /**
   * Toggles the visibility of a specific filter dropdown.
   * @param {string} filterName - The filter category to toggle.
   */
  const toggleFilter = (filterName: string) => {
    if (filterName === "Instrument") return; // Instrument filter is always visible.
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  /** 
   * Sorting dropdown logic.
   * Uses a ref to track outside clicks for closing the sort menu.
   */
  const sortButtonRef = useRef<HTMLDivElement | null>(null);
  const toggleSortFilter = () => setOpenSortFilter(!openSortFilter);

  /**
   * Closes the sorting dropdown when clicking outside of it.
   */
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

  /** 
   * Utility function to check if a filter has active selections.
   * @param {string | string[]} item - The filter value or array of selected values.
   * @returns {boolean} - True if the filter is applied.
   */
  const hasItems = (item: string | string[]) => {
    if (typeof item === "string") {
      return item.trim() !== "";
    }
    if (Array.isArray(item)) {
      return item.length > 0;
    }
    return false;
  };

  /**
   * Determines if any filters have been applied.
   */
  const filtersApplied =
    minTempo > 40 ||
    maxTempo < 200 ||
    hasItems(selectedKeys) ||
    hasItems(selectedGenres) ||
    hasItems(selectedArtists) ||
    hasItems(selectedInstruments) ||
    hasItems(selectedMoods) ||
    hasItems(selectedKeywords);

  /**
   * Resets all filters to their default values.
   */
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
  /**
   * Determines the appropriate border color for filter buttons based on their state.
   * - If the filter is active, apply a blue border.
   * - If the filter is open, apply a highlighted border with a shadow.
   * - Otherwise, use a neutral border color.
   * 
   * @param {string} name - The filter name.
   * @param {string | null} openFilterName - The currently open filter, if any.
   * @param {string | string[]} selectedValue - The selected filter values.
   * @returns {string} - A string of class names to style the filter button.
   */
  const getFilterButtonClass = (
    name: string,
    openFilterName: string | null,
    selectedValue: string | string[]
  ) => {
    let baseClasses =
      "flex flex-row px-3 py-1.5 text-2xs rounded-lg border transition-colors duration-150 bg-transparent text-neutral-600 dark:text-neutral-300 ";

    // Determine if the filter is active
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

    // Apply border color based on filter state
    if (isActive) {
      return baseClasses + "border-blue-500 dark:border-blue-500";
    }

    if (openFilterName === name) {
      return baseClasses + "border-[#D5D5D5] hover:border-neutral-300 dark:border-neutral-200 shadow-md dark:hover:border-neutral-200";
    }

    return baseClasses + "border-neutral-400 hover:border-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500";
  };

  /**
   * Generates a short label for the filter button when a filter is applied.
   * - For numerical values like tempo, it shows the selected range.
   * - For categorical values like genre or mood, it shows the first selection or a count of selections.
   * 
   * @param {string} filterName - The name of the filter.
   * @returns {string} - A short text label representing the selected filter value(s).
   */
  const renderFilterLabel = (filterName: string): string => {
    switch (filterName) {
      case "Key":
        return selectedKeys && selectedScale 
          ? `${selectedKeys} ${selectedScale.toLowerCase()}`
          : "";

      case "Genre":
        return selectedGenres.length === 0 
          ? "" 
          : selectedGenres.length === 1 
          ? selectedGenres[0] 
          : `${selectedGenres[0]} +${selectedGenres.length - 1}`;

      case "Artist":
        return selectedArtists.length === 0 
          ? "" 
          : selectedArtists.length === 1 
          ? selectedArtists[0] 
          : `${selectedArtists[0]} +${selectedArtists.length - 1}`;

      case "Instrument":
        return selectedInstruments.length === 0 
          ? "" 
          : selectedInstruments.length === 1 
          ? selectedInstruments[0] 
          : `${selectedInstruments[0]} +${selectedInstruments.length - 1}`;

      case "Mood":
        return selectedMoods.length === 0 
          ? "" 
          : selectedMoods.length === 1 
          ? selectedMoods[0] 
          : `${selectedMoods[0]} +${selectedMoods.length - 1}`;

      case "Keyword":
        return selectedKeywords.length === 0 
          ? "" 
          : selectedKeywords.length === 1 
          ? selectedKeywords[0] 
          : `${selectedKeywords[0]} +${selectedKeywords.length - 1}`;

      default:
        return "";
    }
  };

  /**
   * Defines a list of filter buttons, each associated with its respective component.
   * - Clicking a button opens its corresponding filter dropdown.
   * - The `onClose` function is passed to each filter to allow closing it when needed.
   */
  const filterButtons = [
    {
      name: "Genre",
      component: (
        <GenreFilter 
          selectedGenres={selectedGenres} 
          onClose={() => toggleFilter("Genre")} 
        />
      ),
    },
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
              const buttonClass = getFilterButtonClass(f.name, openFilter, f.name);

              return (
                <div className="mr-2 relative" key={f.name}>
                  {/* Filter Button */}
                  <button className={buttonClass} onClick={() => toggleFilter(f.name)}>
                    <p className="mr-1.5">
                      {f.name}
                      {label && (
                        <>
                          : <span className="font-semibold">{label}</span>
                        </>
                      )}
                    </p>
                    <FontAwesomeIcon
                      icon={
                        f.name === "Keyword"
                          ? isOpen
                            ? faMinus
                            : faPlus
                          : isOpen
                          ? faChevronUp
                          : faChevronDown
                      }
                      size="2xs"
                      className="mt-1"
                    />
                  </button>

                  {/* Dropdown Filter (visible if the filter is open) */}
                  {isOpen && (
                    <div className="absolute left-0 mt-2 z-50 min-w-[240px]">
                      {f.component}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Clear all button (only if filters are applied) */}
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
            {/* Sort Button */}
            <button
              className="flex flex-row py-1.5 px-4 bg-transparent border rounded-full border-neutral-400 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500 text-neutral-600 dark:text-neutral-300"
              onClick={toggleSortFilter}
            >
              <span className="text-2xs mr-1.5">Sort by:</span>
              <span className="text-2xs font-semibold mr-1.5">{sortBy}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                size="2xs"
                className="cursor-pointer mt-0.5"
              />
            </button>

            {/* Sort Dropdown */}
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