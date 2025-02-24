// src/client/features/sounds/filters/components/shared/FilterLabel.tsx
import { FilterLabelProps } from "@sounds/filters/types";

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
) => {
  const renderMultiSelectLabel = (items: string[] = []) => {
    if (!items?.length) return "";
    return items.length === 1 ? items[0] : `${items[0]} +${items.length - 1}`;
  };

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
    default:
      return "";
  }
};