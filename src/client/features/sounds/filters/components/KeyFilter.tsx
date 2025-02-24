// src\client\features\sounds\filters\components\KeyFilter.tsx
/**
 * @fileoverview Musical key filter component with support for scales and accidentals
 * @module sounds/filters/KeyFilter
 */

import React, { useState, useEffect } from "react";

/**
 * Props interface for KeyFilter component
 */
interface KeyFilterProps {
  selectedKeys: string;
  setSelectedKeys(selectedKeys: string): void;
  selectedScale: string;
  setSelectedScale(selectedScale: string): void;

  setKeyFilterCombinations: (
    keyCombinations: {
      key: string | null;
      "key.note": string | null;
      "key.scale": string | null;
    }[]
  ) => void;

  onClose: () => void;
}


/**
 * Musical constants for key selection
 */
const scales = ["Major", "Minor"];
const accidentals = ["Flat", "Sharp"];
const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
const blackSharpKeys = ["C#", "D#", "F#", "G#", "A#"];
const blackFlatKeys = ["Db", "Eb", "Gb", "Ab", "Bb"];

/**
 * Key filter component for musical key and scale selection
 * Supports relative scales and enharmonic equivalents
 */
const KeyFilter: React.FC<KeyFilterProps> = ({
  onClose,
  selectedKeys,
  setSelectedKeys,
  selectedScale,
  setSelectedScale,
  setKeyFilterCombinations,
}) => {
  // Local state
  const [selectedAccidental, setSelectedAccidental] = useState<string>("Flat");
  const [includeRelativeScales, setIncludeRelativeScales] = useState<boolean>(false);

  /**
   * Helper functions for key management
   */
  const getFlatOrSharp = () => selectedAccidental === "Flat" ? blackFlatKeys : blackSharpKeys;

  /* Get flat and sharp equivalents */
  const getSharpEquivalent = (flatKey: string) => {
    const flatToSharpMap: { [key: string]: string } = {
      Db: "C#",
      Eb: "D#",
      Gb: "F#",
      Ab: "G#",
      Bb: "A#",
    };
    return flatToSharpMap[flatKey] || flatKey;
  };

  const getFlatEquivalent = (sharpKey: string) => {
    const sharpToFlatMap: { [key: string]: string } = {
      "C#": "Db",
      "D#": "Eb",
      "F#": "Gb",
      "G#": "Ab",
      "A#": "Bb",
    };
    return sharpToFlatMap[sharpKey] || sharpKey;
  };

  /**
   * Event handlers for user interactions
   */
  const handleincludeRelativeScalesChange = () => {
    setIncludeRelativeScales(!includeRelativeScales);
  };

  /* White Keys Map*/
  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
  };

  const handleKeyChange = (key: string) => {
    console.log("Selected Key:", key);
    if (blackFlatKeys.includes(key)) {
      setSelectedAccidental("Flat");
    } else if (blackSharpKeys.includes(key)) {
      setSelectedAccidental("Sharp");
    }
    setSelectedKeys(key);
  };

  const handleAccidentalChange = (accidental: string) => {
    setSelectedAccidental(accidental);
    console.log("Changed accidental to:", accidental);

    // Update the selected key to its equivalent flat or sharp if applicable
    if (accidental === "Flat" && blackSharpKeys.includes(selectedKeys)) {
      const flatEquivalent = getFlatEquivalent(selectedKeys);
      setSelectedKeys(flatEquivalent);
    } else if (accidental === "Sharp" && blackFlatKeys.includes(selectedKeys)) {
      const sharpEquivalent = getSharpEquivalent(selectedKeys);
      setSelectedKeys(sharpEquivalent);
    }
  };

  /**
  * Effect for generating key combinations
  * Handles relative scales and enharmonic equivalents
  */
  useEffect(() => {
    // Relative scale mapping
    const majorToMinorMap: { [key: string]: string } = {
      C: "A", "C#": "A#", D: "B", "D#": "C", E: "C#",
      F: "D", "F#": "D#", G: "E", "G#": "F", A: "F#",
      "A#": "G", B: "G#", Db: "Bb", Eb: "C", Gb: "Eb",
      Ab: "F", Bb: "G",
    };
   
  // Create inverse mapping for minor to major
  const minorToMajorMap: { [key: string]: string } = {};
  for (const majorKey in majorToMinorMap) {
    const minorKey = majorToMinorMap[majorKey];
    minorToMajorMap[minorKey] = majorKey;
  }

  /**
    * Gets the relative scale for a given key
    */
  const getRelativeScale = (key: string, isMajor: boolean) => {
    return isMajor ? majorToMinorMap[key] : minorToMajorMap[key];
  };

 /**
  * Adds key and its relative scale to combinations
  */
 const addKeyAndRelativeScale = (
    key: string,
    selectedScale: string,
    includeRelativeScales: boolean
  ) => {
    const result: {
      key: string;
      "key.note": string | null;
      "key.scale": string | null;
    }[] = [];

    const addCombination = (keyNote: string, scaleType: string) => {
      if (keyNote) {
        result.push({
          key: `${keyNote} ${scaleType}`,
          "key.note": keyNote,
          "key.scale": scaleType,
        });
      }
    };

    // Add primary combination
    if (selectedScale === "Major") {
      addCombination(key, "Major");

      if (includeRelativeScales) {
        const relativeMinorKey = getRelativeScale(key, true);
        addCombination(relativeMinorKey, "Minor");

        const enharmonicEquivalent = getFlatEquivalent(relativeMinorKey);
        if (enharmonicEquivalent !== relativeMinorKey) {
          addCombination(enharmonicEquivalent, "Minor");
        }
      }
    }

    if (selectedScale === "Minor") {
      addCombination(key, "Minor");

      if (includeRelativeScales) {
        const relativeMajorKey = getRelativeScale(key, false);
        addCombination(relativeMajorKey, "Major");

        const enharmonicEquivalent = getSharpEquivalent(relativeMajorKey);
        if (enharmonicEquivalent !== relativeMajorKey) {
          addCombination(enharmonicEquivalent, "Major");
        }
      }
    }

    // Add enharmonic equivalents
    const sharpEquivalent = getSharpEquivalent(key);
    const flatEquivalent = getFlatEquivalent(key);

    if (sharpEquivalent !== key) {
      addCombination(sharpEquivalent, selectedScale);
    }
    if (flatEquivalent !== key) {
      addCombination(flatEquivalent, selectedScale);
    }

    return result;
  };

  /**
  * Generates all valid key combinations based on current selections
  */
  const generateKeyCombinations = (
    selectedKeys: string,
    selectedAccidental: string,
    selectedScale: string,
    includeRelativeScales: boolean
  ) => {
    const result: {
      key: string | null;
      "key.note": string | null;
      "key.scale": string | null;
    }[] = [];
    const seen = new Set<string>();

    const addUniqueCombination = (combination: {
      key: string | null;
      "key.note": string | null;
      "key.scale": string | null;
    }) => {
      const uniqueKey = `${combination["key.note"]}-${combination["key.scale"]}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        result.push(combination);
      }
    };

    if (selectedKeys) {
      // Add primary combinations
      const combinations1 = addKeyAndRelativeScale(
        selectedKeys,
        selectedScale,
        includeRelativeScales
      );
      combinations1.forEach(addUniqueCombination);

      // Add equivalent combinations
      const equivalentKey = selectedAccidental === "Flat"
        ? getFlatEquivalent(selectedKeys)
        : getSharpEquivalent(selectedKeys);
      const combinations2 = addKeyAndRelativeScale(
        equivalentKey,
        selectedScale,
        includeRelativeScales
      );
      combinations2.forEach(addUniqueCombination);
    }

    return result;
  };

  // Generate and set combinations
  const keyCombinations = generateKeyCombinations(
    selectedKeys,
    selectedAccidental,
    selectedScale,
    includeRelativeScales
  );

  setKeyFilterCombinations(keyCombinations);
  }, [
  setKeyFilterCombinations,
  selectedKeys,
  selectedScale,
  includeRelativeScales,
  selectedAccidental,
  ]);

  /**
  * UI event handlers
  */
  const handleClearClick = () => {
    setSelectedKeys("");
    setIncludeRelativeScales(false);
  };
  
  const handleCloseClick = () => {
    onClose();
  };
  
  // Split black keys for layout
  const selectedBlackKeysArray = getFlatOrSharp();
  const firstTwoBlackKeys = selectedBlackKeysArray.slice(0, 2);
  const lastThreeBlackKeys = selectedBlackKeysArray.slice(2);
  
  /**
   * Render component
   */
  return (
    <div>
      {/* Desktop Filter - Hidden on mobile breakpoints */}
      <div className="hidden md:block z-10 absolute top-0 bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-8 shadow rounded-lg text-neutral-300 text-xs">
        {/* Accidental Selection Row */}
        <div className="flex items-center mb-4 justify-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 rounded-md p-1 w-full">
          {accidentals.map((accidental: string) => (
            <div className="flex-1 w-full text-center" key={accidental}>
              <button
                onClick={() => handleAccidentalChange(accidental)}
                className={`w-full ${
                  selectedAccidental === accidental
                    ? "bg-blue-500 dark:bg-blue-600 text-neutral-50 dark:text-neutral-50"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-200"
                } py-1 rounded-lg focus:outline-none`}
              >
                {accidental}
              </button>
            </div>
          ))}
        </div>
        {/* Scale Selection Row */}
        <div className="flex items-center mb-4 justify-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 rounded-md p-1 w-full">
          {scales.map((scale: string) => (
            <div className="flex-1 w-full text-center" key={scale}>
              <button
                onClick={() => handleScaleChange(scale)}
                className={`w-full ${
                  selectedScale === scale
                    ? "bg-blue-500 dark:bg-blue-600 text-neutral-50 dark:text-neutral-50"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-200"
                } py-1 rounded-lg focus:outline-none`}
              >
                {scale}
              </button>
            </div>
          ))}
        </div>
        {/* Black Keys Selection - First Two */}
        <div className="flex items-center mb-2">
          <div className="flex-1 ml-5">
            {firstTwoBlackKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyChange(key)}
                className={`w-8 h-10 rounded-md mx-1 focus:outline-none ${
                  selectedKeys === key
                    ? "bg-neutral-600 text-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 border border-neutral-100 dark:border-transparent"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 border border-neutral-300 dark:border-transparent"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          {/* Black Keys Selection - Last Three */}
          <div className="flex-1 mr-5">
            {lastThreeBlackKeys.map((key: string) => (
              <button
                key={key}
                onClick={() => handleKeyChange(key)}
                className={`text-neutral-300 w-8 h-10 rounded-md mx-1 focus:outline-none ${
                  selectedKeys === key
                    ? "bg-neutral-600 text-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 border border-neutral-100 dark:border-transparent"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 border border-neutral-300 dark:border-transparent"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        {/* White Keys Selection */}
        <div className="flex items-center mb-8">
          {whiteKeys.map((key: string) => (
            <button
              key={key}
              onClick={() => handleKeyChange(key)}
              className={`w-8 h-10 rounded-md mx-1 focus:outline-none ${
                selectedKeys === key
                  ? "bg-neutral-300 text-neutral-50 dark:bg-neutral-300 dark:text-neutral-700 border border-neutral-100 dark:border-transparent"
                  : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 border border-neutral-300 dark:border-transparent"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        
        {/* Relative Scales Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={includeRelativeScales}
            onChange={handleincludeRelativeScalesChange}
            className=" active:outline-none focus:outline-none checked:bg-blue-500 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2  w-5 h-5 cursor-pointer"
          />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
            Include relative scale
          </span>
        </div>
        
        {/* Divider */}
        <div className="border-t border-neutral-300 mt-4"></div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleClearClick}
            className="font-medium text-xs rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline px-6 py-1"
          >
            Clear
          </button>
          <button
            onClick={handleCloseClick}
            className="font-medium text-xs rounded-full mr-3 text-neutral-50 bg-blue-500 dark:bg-blue-700 px-6 py-1"
          >
            Close
          </button>
        </div>
      </div>

      {/* Mobile Filter - Visible on mobile breakpoints */}
      <div className="block md:hidden justify-center items-center mx-auto z-10 py-6 text-neutral-300 text-xs w-full">
        <div className="flex items-center mb-4 justify-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 rounded-md p-1 px-1 w-full">
          {accidentals.map((accidental: string) => (
            <div className="flex-1 w-full text-center" key={accidental}>
              <button
                onClick={() => handleAccidentalChange(accidental)}
                className={`w-full hover:cursor-pointer ${
                  selectedAccidental === accidental
                    ? "bg-blue-500 dark:bg-blue-600 text-neutral-50 dark:text-neutral-50"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-200"
                } py-1 rounded-lg focus:outline-none`}
              >
                {accidental}
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center mb-4 justify-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 rounded-md p-1 px-1 w-full">
          {scales.map((scale: string) => (
            <div className="flex-1 w-full text-center" key={scale}>
              <button
                onClick={() => handleScaleChange(scale)}
                className={`w-full hover:cursor-pointer ${
                  selectedScale === scale
                    ? "bg-blue-500 dark:bg-blue-600 text-neutral-50 dark:text-neutral-50"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-200"
                } py-1 rounded-lg focus:outline-none`}
              >
                {scale}
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center mb-4">
          <div className="flex-1 ml-6">
            {firstTwoBlackKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyChange(key)}
                className={`w-8 h-10 hover:cursor-pointer rounded-md mx-1.5 focus:outline-none ${
                  selectedKeys === key
                    ? "bg-neutral-600 text-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 border border-neutral-100 dark:border-transparent"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 border border-neutral-300 dark:border-transparent"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="flex-1 mr-5 w-full">
            {lastThreeBlackKeys.map((key: string) => (
              <button
                key={key}
                onClick={() => handleKeyChange(key)}
                className={`text-neutral-300 w-8 h-10 rounded-md mx-1.5 focus:outline-none ${
                  selectedKeys === key
                    ? "bg-neutral-600 text-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 border border-neutral-100 dark:border-transparent"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 border border-neutral-300 dark:border-transparent"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center mb-8">
          {whiteKeys.map((key: string) => (
            <button
              key={key}
              onClick={() => handleKeyChange(key)}
              className={`w-8 h-10 rounded-md mx-1.5 focus:outline-none ${
                selectedKeys === key
                  ? "bg-neutral-300 text-neutral-50 dark:bg-neutral-300 dark:text-neutral-700 border border-neutral-100 dark:border-transparent"
                  : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 border border-neutral-300 dark:border-transparent"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={includeRelativeScales}
            onChange={handleincludeRelativeScalesChange}
            className=" active:outline-none focus:outline-none checked:bg-blue-500 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2  w-5 h-5 cursor-pointer"
          />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
            Include relative scale
          </span>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearClick}
            className="font-medium text-sm rounded-full text-neutral-500 dark:text-neutral-50 bg-transparent underline"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyFilter;
