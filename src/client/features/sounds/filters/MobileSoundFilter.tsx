// src\client\features\sounds\filters\MobileSoundFilter.tsx
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
import {
  removeAllKeywords,
  removeAllGenres,
} from "@store/slices";
import {
  uniqueArtists,
  uniqueMoods,
  uniqueKeywords,
} from "@tracks/utils";

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
    const uniqueArtistsArray = uniqueArtists(tracks);
    setArtistList(uniqueArtistsArray);

    const uniqueMoodsArray = uniqueMoods(tracks);
    setMoodList(uniqueMoodsArray);

    const uniqueKeywordsArray = uniqueKeywords(tracks);
    setKeywordList(uniqueKeywordsArray);
  }, [dispatch, tracks]);

  /* Filteration */
  const toggleFilter = (filterName: string | null) => {
    if (openFilter === filterName) {
      setOpenFilter(null);
    } else {
      setOpenFilter(filterName);
    }
  };

  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const hasItems = (item: string | string[] | undefined) => {
    if (typeof item === "string") {
      return item.trim() !== "";
    } else if (Array.isArray(item)) {
      return item.length > 0;
    } else {
      return false;
    }
  };

  const calculateAppliedFilterCount = () => {
    let count = 0;

    if (minTempo > 40 || maxTempo < 200) {
      count++;
    }
    if (hasItems(selectedKeys)) {
      count++;
    }
    if (hasItems(selectedGenres)) {
      count++;
    }
    if (hasItems(selectedArtists)) {
      count++;
    }
    return count;
  };

  useEffect(() => {
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
  const [currentExpandedItem, setCurrentExpandedItem] = useState<string | null>(
    null
  );

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const [mobileMenu, setMobileMenu] = useState<{
    [key: string]: boolean;
  }>({
    Sort: false,
    Tempo: false,
    Key: false,
    Genre: false,
    Artist: false,
    Instrument: false,
    Mood: false,
  });

  const toggleExpand = (item: string) => {
    const updatedMobileMenu = { ...mobileMenu };

    if (currentExpandedItem === item) {
      updatedMobileMenu[item] = false;
      setCurrentExpandedItem(null);
    } else {
      updatedMobileMenu[item] = true;
      if (currentExpandedItem !== null) {
        updatedMobileMenu[currentExpandedItem] = false;
      }
      setCurrentExpandedItem(item);
    }

    setMobileMenu(updatedMobileMenu);
  };

  const handleMobileSortChange = (option: string) => {
    handleSortChange(option);
    setMobileMenu((prevState) => ({
      ...prevState,
      Sort: !prevState.Sort, // Toggle the 'Sort' key value
    }));
  };

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

  const renderFilterUpdates = (name: string) => {
    const renderFilterText = (selectedItems: string[]) => {
      if (hasItems(selectedItems)) {
        if (Array.isArray(selectedItems)) {
          if (selectedItems.length > 1) {
            return <span>+{selectedItems.length}</span>;
          } else {
            return <span>{selectedItems[0]}</span>;
          }
        } else {
          return <span>{selectedItems}</span>;
        }
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
      <div className="fixed top-14 md:mt-0 left-0 w-full px-2 py-1 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black z-10">
        <button
          type="button"
          className="w-full text-sm p-0.5 font-semibold text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full"
          onClick={toggleMobileFilter}
        >
          Filter & Sort
        </button>
      </div>
      {mobileFilterOpen && (
          <div className="mobile-filter-width mobile-filter-height block md:hidden fixed top-0 z-40 md:left-22 w-full h-screen bg-white/90 dark:bg-black/90">
            <div className="fixed top-0 mt-16 left-0 md:left-22 w-full rounded-t-lg">
              <div className="p-4 pb-3 rounded-t-xl">
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
                {/* Use .map to create dropdown items */}
                {filterComponents.map(({ name, component }) => (
                  <div
                    key={name}
                    className={`flex flex-col items-start p-4 border-b border-neutral-400 dark:border-neutral-800 hover:cursor-pointer dark:font-medium dark:text-neutral-200 h-auto`}
                  >
                    <button
                      className="flex w-full flex-row justify-between items-start hover:cursor-pointer"
                      onClick={() => toggleExpand(name)}
                    >
                      <p
                        className={`text-sm font-semibold text-neutral-800 dark:text-neutral-200`}
                      >
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
            {/* Mobile Filter */}
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
