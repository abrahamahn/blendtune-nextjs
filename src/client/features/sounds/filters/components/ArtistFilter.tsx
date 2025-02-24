import React, { useState } from "react";
import { FilterWrapper, SearchInput, FilterGrid, Button, ActionButtons } from "@sounds/filters/shared/ui";

/**
* Props interface for ArtistFilter component
*/
interface ArtistFilterProps {
 artists: string[];                                          // List of all available artists
 selectedArtists: string[];                                 // Currently selected artists
 setSelectedArtists: (selectedArtists: string[]) => void;   // Callback to update selections
 onClose: () => void;                                       // Callback when filter is closed
}

/**
* Artist selection filter component with search functionality
* Supports both desktop and mobile layouts
*/
const ArtistFilter: React.FC<ArtistFilterProps> = ({
 artists,
 selectedArtists,
 setSelectedArtists,
 onClose,
}) => {
 const [searchTerm, setSearchTerm] = useState("");

 /**
  * Toggles selection state for an artist
  * Adds or removes artist from selection array
  */
 const handleArtistToggle = (artist: string) => {
   const newSelectedArtists = selectedArtists.includes(artist)
     ? selectedArtists.filter((a) => a !== artist)
     : [...selectedArtists, artist];

   setSelectedArtists(newSelectedArtists);
 };

 /**
  * Filters artists by search term and sorts alphabetically
  */
 const filteredAndSortedArtists = artists
   .filter((artist) => artist.toLowerCase().includes(searchTerm.toLowerCase()))
   .sort();

 return (
    <div>
      {/* Desktop Filter */}
      <FilterWrapper 
        isDesktop={true} 
        width="w-[330px]"
      >
        <SearchInput 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Artists..."
        />

        <FilterGrid 
          columns={2} 
          maxHeight="h-72" 
          width="w-full"
        >
          {filteredAndSortedArtists.map((artist, index) => (
            <button
              key={index}
              className={`
                mb-0 items-center 
                hover:text-neutral-500 dark:hover:text-neutral-200 
                hover:bg-neutral-200 dark:hover:bg-neutral-700 
                rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 
                ${
                  selectedArtists.includes(artist)
                    ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                    : "bg-white/90 dark:bg-black/90 text-neutral-600 dark:text-neutral-300"
                }
              `}
              onClick={() => handleArtistToggle(artist)}
            >
              <p className="ml-1">{artist}</p>
            </button>
          ))}
        </FilterGrid>

        <ActionButtons 
          onClear={() => setSelectedArtists([])}
          onClose={onClose}
        />
      </FilterWrapper>

      {/* Mobile Filter */}
      <FilterWrapper 
        isDesktop={false}
      >
        <SearchInput 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Artists..."
        />

        <FilterGrid 
          columns={3} 
          maxHeight="h-48"
        >
          {filteredAndSortedArtists.map((artist, index) => (
            <button
              key={index}
              className={`
                mb-0 items-center 
                hover:text-neutral-500 dark:hover:text-neutral-200 
                hover:bg-neutral-200 dark:hover:bg-neutral-700 
                rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 
                ${
                  selectedArtists.includes(artist)
                    ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                    : "text-neutral-600 dark:text-neutral-300"
                }
              `}
              onClick={() => handleArtistToggle(artist)}
            >
              <p className="text-xs flex items-center justify-center">
                {artist}
              </p>
            </button>
          ))}
        </FilterGrid>

        <ActionButtons 
          onClear={() => setSelectedArtists([])}
          isMobile={true}
        />
      </FilterWrapper>
    </div>
 );
};

export default ArtistFilter;