// src\client\features\sounds\filters\components\mood.tsx
import React, { useState, useMemo } from "react";

/**
 * Props interface for the MoodFilter component
 * Defines the contract for mood filtering functionality
 */
interface MoodFilterProps {
  /** List of all available moods */
  moods: string[];
  
  /** Currently selected moods */
  selectedMoods: string[];
  
  /** Callback to update selected moods */
  setSelectedMoods: (moods: string[]) => void;
  
  /** Callback to close the filter */
  onClose: () => void;
}

/**
 * MoodFilter component allows users to filter and select moods
 * Supports desktop and mobile responsive designs
 * 
 * @component
 * @example
 * return (
 *   <MoodFilter 
 *     moods={['Happy', 'Sad', 'Energetic']}
 *     selectedMoods={currentMoods}
 *     setSelectedMoods={updateMoods}
 *     onClose={handleFilterClose}
 *   />
 * )
 */
const MoodFilter: React.FC<MoodFilterProps> = ({
  moods,
  selectedMoods,
  setSelectedMoods,
  onClose,
}) => {
  // State for mood search functionality
  const [searchTerm, setSearchTerm] = useState<string>("");

  /**
   * Toggles mood selection
   * Adds or removes mood from selected moods
   * 
   * @param {string} mood - The mood to toggle
   */
  const handleMoodToggle = (mood: string): void => {
    const newMoods = selectedMoods.includes(mood)
      ? selectedMoods.filter((m) => m !== mood)
      : [...selectedMoods, mood];

    setSelectedMoods(newMoods);
  };

  /**
   * Memoized filtered and sorted moods
   * Filters moods based on search term
   * Provides performance optimization
   */
  const filteredAndSortedMoods = useMemo(() => 
    moods
      .filter((mood) => mood.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(), 
    [moods, searchTerm]
  );

  /**
   * Clears all selected moods and search term
   * Resets the filter to its initial state
   */
  const handleClearClick = (): void => {
    setSelectedMoods([]);
    setSearchTerm("");
  };

  /**
   * Handles closing the mood filter
   * Triggers the onClose callback
   */
  const handleCloseClick = (): void => {
    onClose();
  };

  /**
   * Renders mood filter for desktop view
   * @returns {JSX.Element} Desktop filter UI
   */
  const DesktopFilter = () => (
    <div className="hidden md:block z-10 top-0 absolute bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-2 shadow rounded-lg text-neutral-300 text-xs">
      {/* Search input for filtering moods */}
      <div className="w-full flex flex-row mb-4">
        <input
          type="text"
          placeholder="Search Moods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs h-8 rounded-lg bg-white/95 dark:bg-black/90 border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
        />
      </div>

      {/* Mood selection grid */}
      <div className="w-[280px] border rounded-md border-neutral-400 dark:border-neutral-700 grid grid-cols-2 gap-0 overflow-y-auto h-72 scrollbar">
        {filteredAndSortedMoods.map((mood, index) => (
          <button
            key={`desktop-mood-${index}`}
            className={`mb-0 items-center hover:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 ${
              selectedMoods.includes(mood)
                ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                : "bg-white/90 dark:bg-black/90 text-neutral-600 dark:text-neutral-300"
            }`}
            onClick={() => handleMoodToggle(mood)}
          >
            <p className="ml-1">{mood}</p>
          </button>
        ))}
      </div>

      {/* Filter action buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleClearClick}
          className="font-medium text-xs rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline px-6 py-1"
        >
          Clear
        </button>
        <button
          onClick={handleCloseClick}
          className="font-medium text-xs rounded-full mr-3 text-neutral-50 bg-blue-600 dark:bg-blue-600 px-6 py-1"
        >
          Close
        </button>
      </div>
    </div>
  );

  /**
   * Renders mood filter for mobile view
   * @returns {JSX.Element} Mobile filter UI
   */
  const MobileFilter = () => (
    <div className="z-10 block md:hidden py-6 px-2 rounded-lg text-neutral-300 text-sm">
      {/* Search input for filtering moods */}
      <div className="w-full flex flex-row mb-4">
        <input
          type="text"
          placeholder="Search Moods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs h-8 rounded-lg bg-white/95 dark:bg-black/90 border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
        />
      </div>

      {/* Mood selection grid */}
      <div className="w-full h-36 border rounded-md border-neutral-400 dark:border-neutral-700 grid grid-cols-4 gap-0 overflow-y-auto max-h-72 scrollbar">
        {filteredAndSortedMoods.map((mood, index) => (
          <button
            key={`mobile-mood-${index}`}
            className={`mb-0 items-center hover:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 ${
              selectedMoods.includes(mood)
                ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                : "text-neutral-600 dark:text-neutral-300"
            }`}
            onClick={() => handleMoodToggle(mood)}
          >
            <p className="flex text-xs items-center justify-center">{mood}</p>
          </button>
        ))}
      </div>

      {/* Filter action buttons */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleClearClick}
          className="font-medium text-sm rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline"
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <DesktopFilter />
      <MobileFilter />
    </div>
  );
};

export default MoodFilter;