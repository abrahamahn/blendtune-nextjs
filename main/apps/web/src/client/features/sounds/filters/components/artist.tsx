// main/apps/web/src/client/features/sounds/filters/components/artist.tsx
import React, { useState } from 'react';

import { FilterWrapper, SearchInput, FilterGrid, Item, ActionButtons } from '@features/sounds/filters/ui';

interface ArtistFilterProps {
  artists: string[];
  selectedArtists: string[];
  setSelectedArtists: (selectedArtists: string[]) => void;
  onClose: () => void;
}

/** Artist filter panel — searchable multi-select. */
const ArtistFilter: React.FC<ArtistFilterProps> = ({
  artists,
  selectedArtists,
  setSelectedArtists,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleArtistToggle = (artist: string) => {
    setSelectedArtists(
      selectedArtists.includes(artist)
        ? selectedArtists.filter((a) => a !== artist)
        : [...selectedArtists, artist],
    );
  };

  const filteredAndSortedArtists = artists
    .filter((artist) => artist.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort();

  return (
    <FilterWrapper>
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search artists…"
      />
      <FilterGrid columns={2}>
        {filteredAndSortedArtists.map((artist) => (
          <Item
            key={artist}
            selected={selectedArtists.includes(artist)}
            onClick={() => handleArtistToggle(artist)}
          >
            {artist}
          </Item>
        ))}
      </FilterGrid>
      <ActionButtons onClear={() => setSelectedArtists([])} onClose={onClose} />
    </FilterWrapper>
  );
};

export default ArtistFilter;
