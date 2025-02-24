"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faTimes,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { removeAllKeywords, removeAllGenres } from "@store/slices";
import { SortFilter } from "./category";
import { useFilterState } from "./hooks/useFilterState";
import { createFilterComponents } from "@sounds/filters/shared/FilterComponents";
import { hasItems, calculateAppliedFilterCount } from "./utils/filterUtils";
import { SoundFilterProps } from "./types";

const MobileSoundFilter: React.FC<SoundFilterProps> = ({
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
    toggleFilter
  } = useFilterState(tracks);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentExpandedItem, setCurrentExpandedItem] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState<Record<string, boolean>>({
    Sort: false,
    Tempo: false,
    Key: false,
    Genre: false,
    Artist: false,
    Instrument: false,
    Mood: false,
  });

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

  const toggleMobileFilter = () => setMobileFilterOpen(prev => !prev);

  const toggleExpand = (item: string) => {
    if (item === "Instrument") return; // Prevent expanding Instrument filter
    
    setMobileMenu(prev => {
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

  const handleMobileSortChange = (option: string) => {
    handleSortChange(option);
    setMobileMenu(prev => ({
      ...prev,
      Sort: !prev.Sort,
    }));
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

  const renderFilterUpdates = (name: string) => {
    const renderFilterText = (selectedItems: string[]) => {
      if (hasItems(selectedItems)) {
        if (selectedItems.length > 1) {
          return <span className="text-sm">{selectedItems[0]} +{selectedItems.length - 1}</span>;
        } 
        return <span className="text-sm">{selectedItems[0]}</span>;
      }
      return null;
    };

    switch (name) {
      case "Tempo":
        if (minTempo > 40 || maxTempo < 200) {
          return <span className="text-sm">{minTempo} - {maxTempo}</span>;
        }
        break;
      case "Key":
        if (hasItems(selectedKeys)) {
          return <span className="text-sm">{selectedKeys} {selectedScale.toLowerCase().substring(0, 3)}</span>;
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

  const filtersApplied = hasItems(selectedGenres) || 
    hasItems(selectedArtists) || 
    hasItems(selectedInstruments) || 
    hasItems(selectedMoods) || 
    hasItems(selectedKeywords) || 
    minTempo > 40 || 
    maxTempo < 200 || 
    hasItems(selectedKeys);

  const appliedFilterCount = calculateAppliedFilterCount({
    minTempo,
    maxTempo,
    selectedKeys,
    selectedGenres,
    selectedArtists,
  });

  return (
    <div className="block md:hidden w-full">
      {/* Header Button */}
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
            {/* Header */}
            <div className="p-4 pb-3 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-row">
                  <p className="text-neutral-800 dark:text-neutral-200 font-bold text-2xl">
                    Menu {appliedFilterCount > 0 && `(${appliedFilterCount})`}
                  </p>
                  {filtersApplied && (
                    <button
                      className="flex px-3 py-1.5 font-medium text-neutral-600 dark:text-neutral-300 text-xs"
                      onClick={handleClearClick}
                    >
                      <span className="underline text-sm">Clear all</span>
                    </button>
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

            {/* Sort Section */}
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
                      icon={mobileMenu.Sort && currentExpandedItem === "Sort" ? faChevronUp : faAngleDown}
                      size="xs"
                      className="text-neutral-600 dark:text-neutral-200"
                    />
                  </div>
                </button>
                {mobileMenu.Sort && (
                  <div className="flex w-full justify-center items-center">
                    <SortFilter
                      openSortFilter={openSortFilter}
                      mobileFilterOpen={mobileMenu.Sort}
                      sortBy={sortBy}
                      handleSortChange={handleSortChange}
                      handleMobileSortChange={handleMobileSortChange}
                    />
                  </div>
                )}
              </div>

              {/* Filter Components */}
              {filterButtons.map(({ name, component }) => {
                const isInstrument = name === "Instrument";
                const itemExpanded = mobileMenu[name] && currentExpandedItem === name;
                
                return (
                  <div
                    key={name}
                    className={`flex flex-col items-start p-4 border-b border-neutral-400 dark:border-neutral-800 ${
                      isInstrument ? 'bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed' : 'hover:cursor-pointer'
                    } dark:font-medium dark:text-neutral-200 h-auto`}
                  >
                    <button
                      className="flex w-full flex-row justify-between items-start"
                      onClick={() => !isInstrument && toggleExpand(name)}
                      disabled={isInstrument}
                    >
                      <p className={`text-sm font-semibold ${
                        isInstrument ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'
                      }`}>
                        {name}
                      </p>
                      <div className="flex flex-row justify-center items-center">
                        <p className="font-medium text-base mr-3 text-neutral-600 dark:text-neutral-400">
                          {renderFilterUpdates(name)}
                        </p>
                        {!isInstrument && (
                          <FontAwesomeIcon
                            icon={itemExpanded ? faChevronUp : faChevronDown}
                            size="xs"
                            className="text-neutral-600 dark:text-neutral-200 cursor-pointer mt-0.5"
                          />
                        )}
                      </div>
                    </button>
                    <div className="flex w-full justify-center items-center">
                      {itemExpanded && component}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Apply Button */}
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