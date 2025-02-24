// src/client/features/sounds/filters/components/shared/FilterComponents.tsx
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
import { FilterComponentsConfig } from "@sounds/filters/types";

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
