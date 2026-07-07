// main/apps/web/src/client/features/sounds/filters/layout/DesktopFilter.tsx
/**
 * Desktop filter bar: one row of filter chips (the single chip style per the
 * design direction — Seam border, active = amber) with popover panels, plus
 * the sort menu on the right.
 */
import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@ui';
import { SortFilter } from '@features/sounds/filters/components';
import { createFilterComponents, renderFilterLabel } from '@features/sounds/filters/utils';
import { useFilterContext } from '@features/sounds/filters/context';
import { useTracks } from '@client/features/tracks';
import FilterSkeleton from '@features/sounds/filters/components/FilterSkeleton';

import '../filters.css';

const DesktopFilter: React.FC = () => {
  const { isLoading } = useTracks();
  const {
    minTempo,
    setMinTempo,
    maxTempo,
    setMaxTempo,
    includeHalfTime,
    setIncludeHalfTime,
    includeDoubleTime,
    setIncludeDoubleTime,
    selectedKeys,
    setSelectedKeys,
    selectedScale,
    setSelectedScale,
    setKeyFilterCombinations,
    selectedGenres,
    selectedArtists,
    setSelectedArtists,
    selectedInstruments,
    setSelectedInstruments,
    selectedMoods,
    setSelectedMoods,
    selectedKeywords,
    openFilter,
    setOpenFilter,
    openSortFilter,
    setOpenSortFilter,
    sortBy,
    setSortBy,
    toggleFilter,
    clearAllFilters,
    artistList,
    keywordList,
    moodList,
  } = useFilterContext();
  const sortButtonRef = useRef<HTMLDivElement | null>(null);

  // Close the sort dropdown on outside clicks.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sortButtonRef.current && !sortButtonRef.current.contains(event.target as Node)) {
        setOpenSortFilter(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setOpenSortFilter]);

  if (isLoading) {
    return <FilterSkeleton />;
  }

  const hasItems = (item: string | string[]) =>
    typeof item === 'string' ? item.trim() !== '' : item.length > 0;

  const filtersApplied =
    minTempo > 40 ||
    maxTempo < 200 ||
    hasItems(selectedKeys) ||
    hasItems(selectedGenres) ||
    hasItems(selectedArtists) ||
    hasItems(selectedInstruments) ||
    hasItems(selectedMoods) ||
    hasItems(selectedKeywords);

  const handleClearClick = () => {
    clearAllFilters();
    setOpenFilter(null);
  };

  /** Whether a filter currently narrows the catalog (chip goes amber). */
  const isFilterActive = (name: string): boolean => {
    switch (name) {
      case 'Tempo':
        return minTempo > 40 || maxTempo < 200;
      case 'Key':
        return selectedKeys !== '' && selectedScale !== '';
      case 'Genre':
        return selectedGenres.length > 0;
      case 'Artist':
        return selectedArtists.length > 0;
      case 'Instrument':
        return selectedInstruments.length > 0;
      case 'Mood':
        return selectedMoods.length > 0;
      case 'Keyword':
        return selectedKeywords.length > 0;
      default:
        return false;
    }
  };

  const filterButtons = createFilterComponents({
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
    toggleFilter,
    artistList,
    moodList,
    keywordList,
  });

  return (
    <div className="bt-filterbar">
      <div className="bt-filterbar-chips">
        {filterButtons.map((f) => {
          const isOpen = openFilter === f.name;
          const label = renderFilterLabel(f.name, {
            selectedKeys,
            selectedScale,
            selectedGenres,
            selectedArtists,
            selectedInstruments,
            selectedMoods,
            selectedKeywords,
          });
          const chevron =
            f.name === 'Keyword' ? (isOpen ? faMinus : faPlus) : isOpen ? faChevronUp : faChevronDown;
          return (
            <div className="bt-filterbar-slot" key={f.name}>
              <Button
                variant="text"
                size="inline"
                className="bt-chip"
                data-active={isFilterActive(f.name)}
                onClick={() => toggleFilter(f.name)}
                aria-expanded={isOpen}
                aria-controls={`${f.name.toLowerCase()}-filter`}
              >
                {f.name}
                {label !== '' && `: ${label}`}
                <FontAwesomeIcon icon={chevron} size="2xs" aria-hidden="true" />
              </Button>
              {isOpen && (
                <div className="bt-filterbar-pop" id={`${f.name.toLowerCase()}-filter`}>
                  {f.component}
                </div>
              )}
            </div>
          );
        })}
        {filtersApplied && (
          <Button variant="text" size="small" onClick={handleClearClick} aria-label="Clear all filters">
            Clear all
          </Button>
        )}
      </div>

      <div className="bt-filterbar-slot" ref={sortButtonRef}>
        <Button
          variant="text"
          size="inline"
          className="bt-chip"
          onClick={() => setOpenSortFilter(!openSortFilter)}
          aria-expanded={openSortFilter}
          aria-controls="sort-filter"
        >
          Sort by: {sortBy}
          <FontAwesomeIcon icon={openSortFilter ? faChevronUp : faChevronDown} size="2xs" aria-hidden="true" />
        </Button>
        {openSortFilter && (
          <div className="bt-filterbar-pop" data-align="right" id="sort-filter">
            <SortFilter sortBy={sortBy} handleSortChange={setSortBy} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopFilter;
