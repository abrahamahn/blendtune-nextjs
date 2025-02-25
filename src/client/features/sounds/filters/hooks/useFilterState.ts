// src/client/features/sounds/filters/hooks/useFilterState.ts
import { useState, useEffect } from 'react';
import { Track } from "@shared/types/track";
import { uniqueArtists, uniqueMoods, uniqueKeywords } from "@filters/utils";

export const useFilterState = (tracks: Track[]) => {
  const [artistList, setArtistList] = useState<string[]>([]);
  const [moodList, setMoodList] = useState<string[]>([]);
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState(false);

  useEffect(() => {
    setArtistList(uniqueArtists(tracks));
    setMoodList(uniqueMoods(tracks));
    setKeywordList(uniqueKeywords(tracks));
  }, [tracks]);

  const toggleFilter = (filterName: string | null) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  return {
    artistList,
    moodList,
    keywordList,
    openFilter,
    setOpenFilter,
    openSortFilter,
    setOpenSortFilter,
    toggleFilter
  };
};
