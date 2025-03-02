

export interface BaseFilterProps {
  minTempo: number;
  setMinTempo: (val: number) => void;
  maxTempo: number;
  setMaxTempo: (val: number) => void;
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
}

export interface FilterComponentsConfig extends BaseFilterProps {
  toggleFilter: (filterName: string) => void;
  artistList: string[];
  moodList: string[];
  keywordList: string[];
  setKeyFilterCombinations: React.Dispatch<React.SetStateAction<{ key: string | null; "key.note": string | null; "key.scale": string | null; }[]>>
}

export interface FilterLabelProps {
  selectedKeys?: string;
  selectedScale?: string;
  selectedGenres?: string[];
  selectedArtists?: string[];
  selectedInstruments?: string[];
  selectedMoods?: string[];
  selectedKeywords?: string[];
}

export interface SortFilterProps {
    openSortFilter: boolean;
    mobileFilterOpen?: boolean;
    sortBy: string | null;
    handleSortChange: (option: string) => void;
    handleMobileSortChange?: (option: string) => void;
  }

