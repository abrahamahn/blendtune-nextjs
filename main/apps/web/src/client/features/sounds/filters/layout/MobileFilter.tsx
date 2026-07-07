// main/apps/web/src/client/features/sounds/filters/layout/MobileFilter.tsx
/**
 * Mobile filter: a full-width trigger under the header opening a full-screen
 * panel of accordion sections (sort + one per filter).
 */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Button, Heading, Skeleton } from '@ui';
import { SortFilter } from '@features/sounds/filters/components';
import { createFilterComponents } from '@features/sounds/filters/utils/filterUI';
import { hasItems, calculateAppliedFilterCount } from '@features/sounds/filters/utils/filterLogic';
import { useFilterContext } from '@features/sounds/filters/context';
import { useTracks } from '@client/features/tracks';

import '../filters.css';

const MobileFilter: React.FC = () => {
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
    sortBy,
    setSortBy,
    toggleFilter,
    clearAllFilters,
    artistList,
    keywordList,
    moodList,
  } = useFilterContext();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleMobileFilter = () => setMobileFilterOpen((prev) => !prev);

  /** Expands one section at a time. */
  const toggleExpand = (item: string) =>
    setExpandedSection((prev) => (prev === item ? null : item));

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

  /** Condensed summary of a section's current selection. */
  const renderFilterUpdates = (name: string): string | null => {
    const summarize = (selectedItems: string[]) => {
      if (!hasItems(selectedItems)) return null;
      return selectedItems.length > 1
        ? `${selectedItems[0]} +${selectedItems.length - 1}`
        : selectedItems[0];
    };

    switch (name) {
      case 'Tempo':
        return minTempo > 40 || maxTempo < 200 ? `${minTempo} - ${maxTempo}` : null;
      case 'Key':
        return hasItems(selectedKeys)
          ? `${selectedKeys} ${selectedScale.toLowerCase().substring(0, 3)}`
          : null;
      case 'Genre':
        return summarize(selectedGenres);
      case 'Artist':
        return summarize(selectedArtists);
      case 'Instrument':
        return summarize(selectedInstruments);
      case 'Mood':
        return summarize(selectedMoods);
      case 'Keyword':
        return summarize(selectedKeywords);
      default:
        return null;
    }
  };

  const filtersApplied =
    hasItems(selectedGenres) ||
    hasItems(selectedArtists) ||
    hasItems(selectedInstruments) ||
    hasItems(selectedMoods) ||
    hasItems(selectedKeywords) ||
    minTempo > 40 ||
    maxTempo < 200 ||
    hasItems(selectedKeys);

  const appliedFilterCount = calculateAppliedFilterCount({
    minTempo,
    maxTempo,
    selectedKeys,
    selectedGenres,
    selectedArtists,
  });

  const sections = [
    {
      name: 'Sort by',
      summary: sortBy,
      component: (
        <SortFilter
          sortBy={sortBy}
          handleSortChange={(option) => {
            setSortBy(option);
            setExpandedSection(null);
          }}
        />
      ),
    },
    ...filterButtons.map(({ name, component }) => ({
      name,
      summary: renderFilterUpdates(name),
      component,
    })),
  ];

  return (
    <div>
      <div className="bt-mobilefilter-trigger">
        {isLoading ? (
          <Skeleton width="100%" height="2rem" />
        ) : (
          <Button
            variant="secondary"
            size="small"
            onClick={toggleMobileFilter}
            aria-expanded={mobileFilterOpen}
            aria-controls="mobile-filter-panel"
          >
            Filter & sort{appliedFilterCount > 0 && ` (${appliedFilterCount})`}
          </Button>
        )}
      </div>

      {mobileFilterOpen && (
        <div
          className="bt-mobilefilter"
          id="mobile-filter-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Filter and sort options"
        >
          <div className="bt-mobilefilter-head">
            <div className="bt-mobilefilter-head-cluster">
              <Heading as="h2" size="md">
                Filters{appliedFilterCount > 0 && ` (${appliedFilterCount})`}
              </Heading>
              {filtersApplied && (
                <Button variant="text" size="small" onClick={clearAllFilters} aria-label="Clear all filters">
                  Clear all
                </Button>
              )}
            </div>
            <Button
              variant="text"
              size="inline"
              className="bt-header-icon-btn"
              onClick={toggleMobileFilter}
              aria-label="Close filter panel"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" aria-hidden="true" />
            </Button>
          </div>

          <div className="bt-mobilefilter-sections">
            {sections.map(({ name, summary, component }) => {
              const itemExpanded = expandedSection === name;
              const sectionId = `mobile-${name.toLowerCase().replace(/\s/g, '-')}-section`;
              return (
                <div key={name} className="bt-mobilefilter-section">
                  <Button
                    variant="text"
                    size="inline"
                    className="bt-mobilefilter-summary"
                    onClick={() => toggleExpand(name)}
                    aria-expanded={itemExpanded}
                    aria-controls={sectionId}
                  >
                    {name}
                    <span className="bt-mobilefilter-summary-value">
                      {summary}
                      <FontAwesomeIcon
                        icon={itemExpanded ? faChevronUp : faChevronDown}
                        size="xs"
                        aria-hidden="true"
                      />
                    </span>
                  </Button>
                  <div id={sectionId}>{itemExpanded && component}</div>
                </div>
              );
            })}
          </div>

          <div className="bt-mobilefilter-apply">
            <Button variant="primary" onClick={toggleMobileFilter} aria-label="Apply filters and close panel">
              Apply filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFilter;
