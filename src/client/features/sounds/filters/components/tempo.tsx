// src\client\features\sounds\filters\components\tempo.tsx
import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

/**
 * Props interface for the TempoFilter component
 * Defines the contract for tempo filtering functionality
 */
interface TempoFilterProps {
  /** Callback to close the filter */
  onClose: () => void;

  /** Minimum tempo value */
  minTempo: number;

  /** Setter for minimum tempo */
  setMinTempo: (minTempo: number) => void;

  /** Maximum tempo value */
  maxTempo: number;

  /** Setter for maximum tempo */
  setMaxTempo: (maxTempo: number) => void;

  /** Flag to include half-time tracks */
  includeHalfTime: boolean;

  /** Setter for half-time inclusion */
  setIncludeHalfTime: (includeHalfTime: boolean) => void;

  /** Flag to include double-time tracks */
  includeDoubleTime: boolean;

  /** Setter for double-time inclusion */
  setIncludeDoubleTime: (includeDoubleTime: boolean) => void;
}

/**
 * TempoFilter component allows users to filter tracks by tempo
 * Supports setting tempo range and time modification options
 * 
 * @component
 * @example
 * return (
 *   <TempoFilter 
 *     minTempo={60}
 *     maxTempo={180}
 *     setMinTempo={updateMinTempo}
 *     setMaxTempo={updateMaxTempo}
 *     includeHalfTime={halfTimeEnabled}
 *     setIncludeHalfTime={toggleHalfTime}
 *     includeDoubleTime={doubleTimeEnabled}
 *     setIncludeDoubleTime={toggleDoubleTime}
 *     onClose={handleFilterClose}
 *   />
 * )
 */
const TempoFilter: React.FC<TempoFilterProps> = ({
  minTempo,
  setMinTempo,
  maxTempo,
  setMaxTempo,
  includeHalfTime,
  setIncludeHalfTime,
  includeDoubleTime,
  setIncludeDoubleTime,
  onClose,
}) => {
  /** Minimum allowed tempo */
  const MIN_TEMPO = 40;

  /** Maximum allowed tempo */
  const MAX_TEMPO = 200;

  /**
   * Handles checkbox toggle for half-time tracks
   */
  const handleHalfTimeCheckboxChange = () => {
    setIncludeHalfTime(!includeHalfTime);
  };

  /**
   * Handles checkbox toggle for double-time tracks
   */
  const handleDoubleTimeCheckboxChange = () => {
    setIncludeDoubleTime(!includeDoubleTime);
  };

  /**
   * Resets all tempo filter settings to default
   */
  const clearFilter = () => {
    setMinTempo(MIN_TEMPO);
    setMaxTempo(MAX_TEMPO);
    setIncludeHalfTime(false);
    setIncludeDoubleTime(false);
  };

  /**
   * Handles clearing the tempo filter
   */
  const handleClearClick = () => {
    clearFilter();
  };

  /**
   * Handles changes to the tempo slider
   * @param {number | number[]} values - Selected tempo value(s)
   */
  const handleSliderChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      const [minValue, maxValue] = values;

      if (minValue === MIN_TEMPO && maxValue === MAX_TEMPO) {
        setMinTempo(MIN_TEMPO);
        setMaxTempo(MAX_TEMPO);
      } else {
        setMinTempo(minValue);
        setMaxTempo(maxValue);
      }
    } else {
      setMinTempo(values);
      setMaxTempo(values);
    }
  };

  /**
   * Handles closing the tempo filter
   */
  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div>
      {/* Desktop Filter */}
      <div className="hidden md:block z-10 absolute top-0 bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-8 shadow rounded-lg text-neutral-300 text-xs">
        <Slider
          min={MIN_TEMPO}
          max={MAX_TEMPO}
          range
          value={[minTempo, maxTempo]}
          onChange={handleSliderChange}
          className="w-full mt-4"
          handleStyle={[
            {
              backgroundColor: "#1E4ED8",
              borderColor: "#2f5cd8",
              opacity: 1,
              borderWidth: 0.5,
            },
            {
              backgroundColor: "#1E4ED8",
              borderColor: "#2f5cd8",
              opacity: 1,
              borderWidth: 0.5,
            },
          ]}
          trackStyle={[{ backgroundColor: "#1E4ED8" }]}
          railStyle={{ backgroundColor: "#73737390" }}
          activeDotStyle={{ borderColor: "yellow" }}
        />
        <div className="flex flex-row mt-4">
          <div className="flex flex-col w-24">
            <label
              htmlFor="minTempo"
              className="text-neutral-500 dark:text-neutral-200"
            >
              From
            </label>
            <input
              type="text"
              id="minTempo"
              placeholder="From"
              value={minTempo === MIN_TEMPO ? "40" : minTempo}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setMinTempo(isNaN(value) ? MIN_TEMPO : value);
              }}
              className="text-neutral-500 dark:text-neutral-200 rounded-md border border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800 text-sm h-8 mt-1"
            />
          </div>
          <div className="border-t border-neutral-500 mt-9 w-8 mx-4"></div>
          <div className="flex flex-col w-24">
            <label
              htmlFor="maxTempo"
              className="text-neutral-500 dark:text-neutral-200"
            >
              To
            </label>
            <input
              type="text"
              id="maxTempo"
              placeholder="To"
              value={maxTempo === MAX_TEMPO ? "200" : maxTempo}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setMaxTempo(isNaN(value) ? MAX_TEMPO : value);
              }}
              className="text-neutral-500 dark:text-neutral-200 rounded-md border border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800 text-sm h-8 mt-1"
            />
          </div>
        </div>
        <div className="flex flex-col items-start mt-4">
          <div className="flex flex-row mb-2">
            <input
              type="checkbox"
              checked={includeHalfTime}
              onChange={handleHalfTimeCheckboxChange}
              className="active:outline-none focus:outline-none checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2 w-5 h-5 cursor-pointer"
            />
            <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
              Include half time
            </span>
          </div>
          <div>
            <input
              type="checkbox"
              checked={includeDoubleTime}
              onChange={handleDoubleTimeCheckboxChange}
              className="active:outline-none focus:outline-none checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2 w-5 h-5 cursor-pointer"
            />
            <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
              Include double time
            </span>
          </div>
        </div>
        <div className="border-t border-neutral-300 mt-4"></div>
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

      {/* Mobile Filter */}
      <div className="block md:hidden justify-center items-center mx-auto z-10 w-full text-neutral-500 dark:text-neutral-300 text-xs py-4">
        <Slider
          min={MIN_TEMPO}
          max={MAX_TEMPO}
          range
          value={[minTempo, maxTempo]}
          onChange={handleSliderChange}
          className="w-full mt-4"
          handleStyle={[
            {
              backgroundColor: "#1E4ED8",
              borderColor: "#2f5cd8",
              opacity: 1,
              borderWidth: 0.5,
            },
            {
              backgroundColor: "#1E4ED8",
              borderColor: "#2f5cd8",
              opacity: 1,
              borderWidth: 0.5,
            },
          ]}
          trackStyle={[{ backgroundColor: "#1E4ED8" }]}
          railStyle={{ backgroundColor: "#73737390" }}
          activeDotStyle={{ borderColor: "yellow" }}
        />
        <div className="flex flex-row mt-4">
          <div className="flex flex-col w-28">
            <label
              htmlFor="minTempo"
              className="text-sm text-neutral-500 dark:text-neutral-200"
            >
              From
            </label>
            <input
              type="text"
              id="minTempo"
              placeholder="From"
              value={minTempo === MIN_TEMPO ? "40" : minTempo}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setMinTempo(isNaN(value) ? MIN_TEMPO : value);
              }}
              className="text-neutral-500 dark:text-neutral-200 rounded-md border border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800 text-sm h-8 mt-1"
            />
          </div>
          <div className="border-t border-neutral-500 mt-9 w-8 mx-4"></div>
          <div className="flex flex-col w-28">
            <label
              htmlFor="maxTempo"
              className="text-sm text-neutral-500 dark:text-neutral-200"
            >
              To
            </label>
            <input
              type="text"
              id="maxTempo"
              placeholder="To"
              value={maxTempo === MAX_TEMPO ? "200" : maxTempo}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setMaxTempo(isNaN(value) ? MAX_TEMPO : value);
              }}
              className="text-neutral-500 dark:text-neutral-200 rounded-md border border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800 text-sm h-8 mt-1"
            />
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row mb-2">
            <input
              type="checkbox"
              checked={includeHalfTime}
              onChange={handleHalfTimeCheckboxChange}
              className="active:outline-none focus:outline-none checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2 w-5 h-5 cursor-pointer"
            />
            <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
              Include half time
            </span>
          </div>
          <div>
            <input
              type="checkbox"
              checked={includeDoubleTime}
              onChange={handleDoubleTimeCheckboxChange}
              className="active:outline-none focus:outline-none checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2 w-5 h-5 cursor-pointer"
            />
            <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
              Include double time
            </span>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleClearClick}
              className="font-medium text-sm rounded-full text-neutral-500 dark:text-neutral-50 bg-transparent underline py-1"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempoFilter;