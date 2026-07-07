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
import { FilterComponentsConfig, FilterLabelProps } from "@features/sounds/filters/types";

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
