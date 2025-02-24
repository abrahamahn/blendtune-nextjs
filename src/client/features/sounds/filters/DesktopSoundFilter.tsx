"use client";
import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { removeAllKeywords, removeAllGenres } from "@store/slices";
import { SortFilter } from "./components";
import { useFilterState } from "./hooks/useFilterState";
import { createFilterComponents } from "@features/sounds/filters/shared/FilterComponents";
import { renderFilterLabel } from "@features/sounds/filters/shared/FilterLabel";
import { SoundFilterProps } from "./types";

const DesktopSoundFilter: React.FC<SoundFilterProps> = ({
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
  const {
    artistList,
    moodList,
    keywordList,
    openFilter,
    setOpenFilter,
    openSortFilter,
    setOpenSortFilter,
    toggleFilter
  } = useFilterState(tracks);

  const sortButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sortButtonRef.current && !sortButtonRef.current.contains(event.target as Node)) {
        setOpenSortFilter(false);
      }
    };
    
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setOpenSortFilter]);

  const hasItems = (item: string | string[]) => {
    if (typeof item === "string") {
      return item.trim() !== "";
    }
    if (Array.isArray(item)) {
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

  const getFilterButtonClass = (name: string) => {
    const baseClasses = "flex flex-row px-3 py-1.5 text-2xs rounded-lg border transition-colors duration-150 bg-transparent text-neutral-600 dark:text-neutral-300 ";

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

    if (isActive) {
      return baseClasses + "border-blue-500 dark:border-blue-500";
    }

    if (openFilter === name) {
      return baseClasses + "border-[#D5D5D5] hover:border-neutral-300 dark:border-neutral-200 shadow-md dark:hover:border-neutral-200";
    }

    return baseClasses + "border-neutral-400 hover:border-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500";
  };

  const filterButtons = createFilterComponents({
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
    toggleFilter,
    artistList,
    moodList,
    keywordList,
  });

  return (
    <div className="hidden md:block w-full border-neutral-600 bg-white dark:bg-neutral-950 sticky top-0 py-2 z-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-row justify-between items-center w-full">
          {/* Filter Buttons */}
          <div className="flex flex-row items-center">
            {filterButtons.map((f) => {
              const isOpen = openFilter === f.name;
              const label = renderFilterLabel(f.name, {
                selectedKeys,
                selectedScale,
                selectedGenres,
                selectedArtists,
                selectedInstruments,
                selectedMoods,
                selectedKeywords,
              });
              const buttonClass = getFilterButtonClass(f.name);

              return (
                <div className="mr-2 relative" key={f.name}>
                  <button 
                    className={buttonClass}
                    onClick={() => toggleFilter(f.name)}
                  >
                    <p className="mr-1.5">
                      {f.name}
                      {label && (
                        <>: <span className="font-semibold">{label}</span></>
                      )}
                    </p>
                    <FontAwesomeIcon
                      icon={f.name === "Keyword" ? (isOpen ? faMinus : faPlus) : (isOpen ? faChevronUp : faChevronDown)}
                      size="2xs"
                      className="mt-1"
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 mt-2 z-50 min-w-[240px]">
                      {f.component}
                    </div>
                  )}
                </div>
              );
            })}

            {filtersApplied && (
              <button
                className="px-2 py-1.5 text-2xs rounded-lg text-[#707070] dark:text-neutral-300"
                onClick={handleClearClick}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort Filter */}
          <div ref={sortButtonRef} className="relative">
            <button
              className="flex flex-row py-1.5 px-4 bg-transparent border rounded-full border-neutral-400 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500 text-neutral-600 dark:text-neutral-300"
              onClick={() => setOpenSortFilter(!openSortFilter)}
            >
              <span className="text-2xs mr-1.5">Sort by:</span>
              <span className="text-2xs font-semibold mr-1.5">{sortBy}</span>
              <FontAwesomeIcon
                icon={openSortFilter ? faChevronUp : faChevronDown}
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