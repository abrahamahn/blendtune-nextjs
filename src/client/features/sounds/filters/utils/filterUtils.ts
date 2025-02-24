
export const hasItems = (item: string | string[] | undefined) => {
    if (typeof item === "string") {
      return item.trim() !== "";
    }
    if (Array.isArray(item)) {
      return item.length > 0;
    }
    return false;
  };
  
  export const calculateFiltersApplied = ({
    minTempo,
    maxTempo,
    selectedKeys,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
  }: {
    minTempo: number;
    maxTempo: number;
    selectedKeys: string;
    selectedGenres: string[];
    selectedArtists: string[];
    selectedInstruments: string[];
    selectedMoods: string[];
    selectedKeywords: string[];
  }) => {
    return (
      minTempo > 40 ||
      maxTempo < 200 ||
      hasItems(selectedKeys) ||
      hasItems(selectedGenres) ||
      hasItems(selectedArtists) ||
      hasItems(selectedInstruments) ||
      hasItems(selectedMoods) ||
      hasItems(selectedKeywords)
    );
  };
  
  export const calculateAppliedFilterCount = ({
    minTempo,
    maxTempo,
    selectedKeys,
    selectedGenres,
    selectedArtists,
  }: {
    minTempo: number;
    maxTempo: number;
    selectedKeys: string;
    selectedGenres: string[];
    selectedArtists: string[];
  }) => {
    let count = 0;
    if (minTempo > 40 || maxTempo < 200) count++;
    if (hasItems(selectedKeys)) count++;
    if (hasItems(selectedGenres)) count++;
    if (hasItems(selectedArtists)) count++;
    return count;
  };