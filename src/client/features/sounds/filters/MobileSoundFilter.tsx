// src/client/features/sounds/filters/MobileSoundFilter.tsx

"use client";
import React, { useState, useEffect, useRef, type JSX } from "react";
import { Track } from "@/shared/types/track";
import {
  ArtistFilter,
  GenreFilter,
  InstrumentFilter,
  KeyFilter,
  KeywordFilter,
  MoodFilter,
  TempoFilter,
  SortFilter,
} from "./components";

import { useDispatch } from "react-redux";
import { removeAllKeywords, removeAllGenres } from "@store/slices";
import { uniqueArtists, uniqueMoods, uniqueKeywords } from "@tracks/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faChevronDown,
  faChevronUp,
  faTimes,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

interface FilterComponent {
  name: string;
  component: JSX.Element;
}

interface MobileSoundFilterProps {
  tracks: Track[];

  minTempo: number;
  setMinTempo: (minTempo: number) => void;
  maxTempo: number;
  setMaxTempo: (maxTempo: number) => void;
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
  setSelectedKeys: (val: string) => void;
  selectedScale: string;
  setSelectedScale: (val: string) => void;

  selectedGenres: string[];

  selectedArtists: string[];
  setSelectedArtists: (val: string[]) => void;

  selectedInstruments: string[];
  setSelectedInstruments: (val: string[]) => void;

  selectedMoods: string[];
  setSelectedMoods: (val: string[]) => void;

  selectedKeywords: string[];

  sortBy: string | null;
  handleSortChange: (option: string) => void;
}

const MobileSoundFilter: React.FC<MobileSoundFilterProps> = ({
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

  /* Extract Unique Keyword List */
  const [artistList, setArtistList] = useState<string[]>([]);
  const [moodList, setMoodList] = useState<string[]>([]);
  const [keywordList, setKeywordList] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique values for filtering
    setArtistList(uniqueArtists(tracks));
    setMoodList(uniqueMoods(tracks));
    setKeywordList(uniqueKeywords(tracks));
  }, [tracks]); // Removed `dispatch` dependency (not needed)

  /* Filtering State */
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  /**
   * Toggles the visibility of a specific filter.
   * @param {string | null} filterName - The name of the filter to toggle.
   */
  const toggleFilter = (filterName: string | null) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  /**
   * Checks if an item has values to determine if a filter is applied.
   * @param {string | string[] | undefined} item - The item to check.
   * @returns {boolean} - True if the item is not empty or contains values.
   */
  const hasItems = (item: string | string[] | undefined) => {
    if (typeof item === "string") {
      return item.trim() !== "";
    }
    if (Array.isArray(item)) {
      return item.length > 0;
    }
    return false;
  };

  /**
   * Calculates the number of applied filters based on user selections.
   * @returns {number} - The count of applied filters.
   */
  const calculateAppliedFilterCount = () => {
    let count = 0;

    if (minTempo > 40 || maxTempo < 200) count++;
    if (hasItems(selectedKeys)) count++;
    if (hasItems(selectedGenres)) count++;
    if (hasItems(selectedArtists)) count++;

    return count;
  };

  useEffect(() => {
    // Determine if any filter is currently applied
    const anyFilterApplied =
      minTempo > 40 ||
      maxTempo < 200 ||
      hasItems(selectedKeys) ||
      hasItems(selectedGenres) ||
      hasItems(selectedArtists) ||
      hasItems(selectedInstruments) ||
      hasItems(selectedMoods) ||
      hasItems(selectedKeywords);

    setFiltersApplied(anyFilterApplied);
  }, [
    minTempo,
    maxTempo,
    selectedKeys,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
  ]);

  /* Sort Filter Functions */
  const sortButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /**
     * Handles clicks outside the sort button to close the sort filter dropdown.
     * @param {MouseEvent} event - The event object.
     */
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setOpenSortFilter(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  /* Mobile Filter Functions */
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentExpandedItem, setCurrentExpandedItem] = useState<string | null>(null);

  /**
   * Toggles the mobile filter panel visibility.
   */
  const toggleMobileFilter = () => {
    setMobileFilterOpen((prev) => !prev);
  };

  // State for managing expanded filter sections in the mobile menu.
  const [mobileMenu, setMobileMenu] = useState<Record<string, boolean>>({
    Sort: false,
    Tempo: false,
    Key: false,
    Genre: false,
    Artist: false,
    Instrument: false,
    Mood: false,
  });

  /**
   * Toggles the expansion state of a filter item in the mobile menu.
   * @param {string} item - The filter category to toggle.
   */
  const toggleExpand = (item: string) => {
    setMobileMenu((prev) => {
      const updatedMenu = { ...prev };
      
      if (currentExpandedItem === item) {
        updatedMenu[item] = false;
        setCurrentExpandedItem(null);
      } else {
        updatedMenu[item] = true;
        if (currentExpandedItem !== null) {
          updatedMenu[currentExpandedItem] = false;
        }
        setCurrentExpandedItem(item);
      }

      return updatedMenu;
    });
  };

  /**
   * Handles sorting changes in the mobile filter panel.
   * @param {string} option - The selected sort option.
   */
  const handleMobileSortChange = (option: string) => {
    handleSortChange(option);
    setMobileMenu((prevState) => ({
      ...prevState,
      Sort: !prevState.Sort, // Toggle sorting menu visibility
    }));
  };

  /**
   * List of filter components with associated names.
   */
  const filterComponents: FilterComponent[] = [
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

  /**
   * Renders the applied filter values dynamically.
   * @param {string} name - The name of the filter to render.
   * @returns {JSX.Element | null} - The rendered filter update text or null if no filter is applied.
   */
  const renderFilterUpdates = (name: string) => {
    /**
     * Helper function to render selected filter values.
     * @param {string[]} selectedItems - The selected filter items.
     * @returns {JSX.Element | null} - A span element displaying the count or first selected item.
     */
    const renderFilterText = (selectedItems: string[]) => {
      if (hasItems(selectedItems)) {
        if (selectedItems.length > 1) {
          return <span>+{selectedItems.length}</span>;
        } 
        return <span>{selectedItems[0]}</span>;
      }
      return null;
    };

    switch (name) {
      case "Tempo":
        if (minTempo > 40 || maxTempo < 200) {
          return (
            <span>
              {minTempo} - {maxTempo}
            </span>
          );
        }
        break;

      case "Key":
        if (hasItems(selectedKeys)) {
          return (
            <span>
              {selectedKeys} {selectedScale.toLowerCase().substring(0, 3)}
            </span>
          );
        }
        break;

      case "Genre":
        return renderFilterText(selectedGenres);

      case "Artist":
        return renderFilterText(selectedArtists);

      case "Instrument":
        return renderFilterText(selectedInstruments);

      case "Mood":
        return renderFilterText(selectedMoods);

      case "Keyword":
        return renderFilterText(selectedKeywords);

      default:
        return null;
    }
  };

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

  return (
    <div className="block md:hidden w-full">
      {/* Header: Filter & Sort Button */}
      <div className="fixed top-14 md:mt-0 left-0 w-full px-2 py-1 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black z-10">
        <button
          type="button"
          className="w-full text-sm p-0.5 font-semibold text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full"
          onClick={toggleMobileFilter}
        >
          Filter & Sort
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {mobileFilterOpen && (
        <div className="mobile-filter-width mobile-filter-height block md:hidden fixed top-0 z-40 md:left-22 w-full h-screen bg-white/90 dark:bg-black/90">
          <div className="fixed top-0 mt-16 left-0 md:left-22 w-full rounded-t-lg">
            <div className="p-4 pb-3 rounded-t-xl">
              {/* Header: Menu Title & Clear All Button */}
              <div className="flex justify-between items-center">
                <div className="flex flex-row">
                  <p className="text-neutral-800 dark:text-neutral-200 font-bold text-2xl">
                    Menu{" "}
                    {calculateAppliedFilterCount() > 0 &&
                      `(${calculateAppliedFilterCount()})`}
                  </p>
                  {filtersApplied && (
                    <div className="flex justify-center items-center ml-1">
                      <button
                        className="flex px-3 py-1.5 font-medium text-neutral-600 dark:text-neutral-300 text-xs"
                        onClick={handleClearClick}
                      >
                        <span className="underline text-sm">Clear all</span>
                      </button>
                    </div>
                  )}
                </div>
                {/* Close Button */}
                <button
                  className="rounded-full p-2 cursor-pointer"
                  onClick={toggleMobileFilter}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    className="text-neutral-600 dark:text-white"
                  />
                </button>
              </div>
            </div>

            {/* Sort Filter Section */}
            <div>
              <div className="flex flex-col items-start p-4 border-b border-neutral-400 dark:border-neutral-800 hover:cursor-pointer dark:font-medium dark:text-neutral-200 h-auto">
                <button
                  className="flex w-full flex-row justify-between items-start hover:cursor-pointer"
                  onClick={() => toggleExpand("Sort")}
                >
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Sort by
                  </p>
                  <div className="flex flex-row justify-center items-center">
                    <p className="font-medium text-sm mr-3 text-neutral-600 dark:text-neutral-400">
                      {sortBy}
                    </p>
                    <FontAwesomeIcon
                      icon={
                        mobileMenu.Sort && currentExpandedItem === "Sort"
                          ? faChevronUp
                          : faAngleDown
                      }
                      size="xs"
                      className="text-neutral-600 dark:text-neutral-200"
                    />
                  </div>
                </button>
                <div className="flex w-full justify-center items-center">
                  {mobileMenu.Sort && (
                    <SortFilter
                      openSortFilter={openSortFilter}
                      mobileFilterOpen={mobileMenu.Sort}
                      sortBy={sortBy}
                      handleSortChange={handleSortChange}
                      handleMobileSortChange={handleMobileSortChange}
                    />
                  )}
                </div>
              </div>

              {/* Filter Components Rendering */}
              {filterComponents.map(({ name, component }) => (
                <div
                  key={name}
                  className="flex flex-col items-start p-4 border-b border-neutral-400 dark:border-neutral-800 hover:cursor-pointer dark:font-medium dark:text-neutral-200 h-auto"
                >
                  <button
                    className="flex w-full flex-row justify-between items-start hover:cursor-pointer"
                    onClick={() => toggleExpand(name)}
                  >
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {name}
                    </p>
                    <div className="flex flex-row justify-center items-center">
                      <p className="font-medium text-base mr-3 text-neutral-600 dark:text-neutral-400">
                        {renderFilterUpdates(name)}
                      </p>
                      <FontAwesomeIcon
                        icon={
                          mobileMenu[name] && currentExpandedItem === name
                            ? faChevronUp
                            : faChevronDown
                        }
                        size="xs"
                        className={`text-neutral-600 dark:text-neutral-200 cursor-pointer mt-0.5 ${
                          mobileMenu[name] && currentExpandedItem === name
                            ? "chevron-up"
                            : "chevron-down"
                        }`}
                      />
                    </div>
                  </button>
                  <div className="flex w-full justify-center items-center">
                    {mobileMenu[name] ? component : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="z-30 w-full block justify-end items-end xl:hidden absolute left-0 bottom-4 px-4 bg-white dark:bg-black dark:border-neutral-800 py-4">
            <button
              type="button"
              className="w-full h-12 text-base p-1 font-semibold text-white bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full"
              onClick={toggleMobileFilter}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSoundFilter;
