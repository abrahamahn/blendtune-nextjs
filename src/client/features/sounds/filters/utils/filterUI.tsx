// src/client/features/sounds/filters/utils/filterUI.ts
import React from 'react';
import {
  GenreFilter,
  TempoFilter,
  KeyFilter,
  ArtistFilter,
  InstrumentFilter,
  MoodFilter,
  KeywordFilter,
} from "../components";
import { FilterComponentsConfig, FilterLabelProps } from "@sounds/filters/types";

/**
 * Creates filter components based on provided configuration
 * Returns an array of filter objects with name and component properties
 * 
 * @param {FilterComponentsConfig} config - Configuration for filter components
 * @returns {Array<{name: string, component: React.ReactNode}>} - Array of filter objects
 */
export const createFilterComponents = ({
  selectedGenres,
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
}: FilterComponentsConfig) => [
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
 * Renders a readable label for filters based on selected values
 * Used for displaying current filter state in UI
 * 
 * @param {string} filterName - Name of the filter
 * @param {FilterLabelProps} props - Current filter selection values
 * @returns {string} Formatted display label
 */
export const renderFilterLabel = (
  filterName: string,
  {
    selectedKeys,
    selectedScale,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
  }: FilterLabelProps
): string => {
  /**
   * Helper to render labels for multi-select filters
   * Shows first selected item and count of additional items if present
   */
  const renderMultiSelectLabel = (items: string[] = []): string => {
    if (!items?.length) return "";
    return items.length === 1 ? items[0] : `${items[0]} +${items.length - 1}`;
  };

  // Return appropriate label based on filter type
  switch (filterName) {
    case "Key":
      return selectedKeys && selectedScale 
        ? `${selectedKeys} ${selectedScale.toLowerCase()}`
        : "";
    case "Genre":
      return renderMultiSelectLabel(selectedGenres);
    case "Artist":
      return renderMultiSelectLabel(selectedArtists);
    case "Instrument":
      return renderMultiSelectLabel(selectedInstruments);
    case "Mood":
      return renderMultiSelectLabel(selectedMoods);
    case "Keyword":
      return renderMultiSelectLabel(selectedKeywords);
    case "Tempo":
      if (selectedKeys === "Tempo") {
        // Optional: Add tempo range display logic here if needed
      }
      return "";
    default:
      return "";
  }
};

/**
 * Determines if a filter button should be highlighted as active
 * 
 * @param {string} filterName - Name of the filter
 * @param {Object} filterState - Current state of all filters
 * @returns {boolean} Whether the filter should be highlighted
 */
export const isFilterActive = (
  filterName: string,
  {
    minTempo,
    maxTempo,
    selectedKeys,
    selectedScale,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
  }: {
    minTempo: number;
    maxTempo: number;
    selectedKeys: string;
    selectedScale: string;
    selectedGenres: string[];
    selectedArtists: string[];
    selectedInstruments: string[];
    selectedMoods: string[];
    selectedKeywords: string[];
  }
): boolean => {
  switch (filterName) {
    case "Tempo":
      return minTempo > 40 || maxTempo < 200;
    case "Key":
      return !!selectedKeys && !!selectedScale;
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
};

/**
 * Generates filter button styling classes based on active state
 * 
 * @param {string} name - Filter name
 * @param {boolean} isActive - Whether filter is active
 * @param {string|null} openFilter - Currently open filter
 * @returns {string} Tailwind CSS classes for the filter button
 */
export const getFilterButtonClass = (
  name: string,
  isActive: boolean,
  openFilter: string | null
): string => {
  const baseClasses = "flex flex-row px-3 py-1.5 text-2xs rounded-lg border transition-colors duration-150 bg-transparent text-neutral-600 dark:text-neutral-300 ";

  if (isActive) {
    return baseClasses + "border-blue-500 dark:border-blue-500";
  }

  if (openFilter === name) {
    return baseClasses + "border-[#D5D5D5] hover:border-neutral-300 dark:border-neutral-200 shadow-md dark:hover:border-neutral-200";
  }

  return baseClasses + "border-neutral-400 hover:border-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500";
};