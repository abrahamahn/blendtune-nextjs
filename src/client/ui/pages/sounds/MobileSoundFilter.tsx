"use client";
import React, { useState, useEffect, useRef } from "react";
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
} from "./filters";

import { useDispatch } from "react-redux";
import {
  removeAllKeywords,
  removeAllGenres,
} from "@/client/environment/redux/slices/keyword";
import {
  uniqueArtists,
  uniqueMoods,
  uniqueKeywords,
} from "@/client/utils/data/uniqueKeywords";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faChevronDown,
  faChevronUp,
  faTimes,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

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

  const [artistList, setArtistList] = useState<string[]>([]);
  const [moodList, setMoodList] = useState<string[]>([]);
  const [keywordList, setKeywordList] = useState<string[]>([]);

  useEffect(() => {
    setArtistList(uniqueArtists(tracks));
    setMoodList(uniqueMoods(tracks));
    setKeywordList(uniqueKeywords(tracks));
  }, [tracks]);

  // ✅ Correctly initialize `openSortFilter`
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSortFilter, setOpenSortFilter] = useState(false);

  const toggleMobileFilter = () => setMobileFilterOpen(!mobileFilterOpen);
  const toggleSortFilter = () => setOpenSortFilter(!openSortFilter);

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
  };

  return (
    <div className="block md:hidden w-full">
      <div className="fixed top-16 left-0 w-full p-2 border-b border-neutral-200 dark:border-neutral-800 z-10">
        <button
          type="button"
          className="w-full text-sm p-1 font-semibold text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full"
          onClick={toggleMobileFilter}
        >
          Filter & Sort
        </button>
      </div>

      {mobileFilterOpen && (
        <div className="fixed top-0 left-0 w-full h-screen z-20 overflow-y-auto">
          <div className="fixed top-0 mt-16 w-full rounded-t-lg">
            <div className="p-4 pb-3 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-row">
                  <p className="text-neutral-800 dark:text-neutral-200 font-bold text-2xl">
                    Filters
                  </p>
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

            {/* ✅ Sort Filter */}
            <div className="p-4 border-b border-neutral-400 dark:border-neutral-800">
              <button
                className="w-full flex justify-between items-center"
                onClick={toggleSortFilter}
              >
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Sort by
                </p>
                <FontAwesomeIcon
                  icon={openSortFilter ? faChevronUp : faAngleDown}
                  size="xs"
                  className="text-neutral-600 dark:text-neutral-200"
                />
              </button>
              {openSortFilter && (
                <div className="mt-2">
                  <SortFilter
                    openSortFilter={openSortFilter}
                    mobileFilterOpen={mobileFilterOpen}
                    sortBy={sortBy}
                    handleSortChange={handleSortChange}
                    handleMobileSortChange={handleSortChange}
                  />
                </div>
              )}
            </div>

            {/* ✅ Filters (Genre, Tempo, Key, etc.) */}
            <div className="p-4">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Filters
              </p>
              <GenreFilter selectedGenres={selectedGenres} onClose={toggleMobileFilter} />
              <TempoFilter
                minTempo={minTempo}
                setMinTempo={setMinTempo}
                maxTempo={maxTempo}
                setMaxTempo={setMaxTempo}
                includeHalfTime={includeHalfTime}
                setIncludeHalfTime={setIncludeHalfTime}
                includeDoubleTime={includeDoubleTime}
                setIncludeDoubleTime={setIncludeDoubleTime}
                onClose={toggleMobileFilter}
              />
              <KeyFilter
                setKeyFilterCombinations={setKeyFilterCombinations}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                selectedScale={selectedScale}
                setSelectedScale={setSelectedScale}
                onClose={toggleMobileFilter}
              />
            </div>
          </div>

          {/* ✅ Apply Filters Button */}
          <div className="w-full absolute bottom-4 px-4 bg-white dark:bg-black py-4">
            <button
              type="button"
              className="w-full h-12 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full"
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
