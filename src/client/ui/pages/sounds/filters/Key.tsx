import React, { useState, useEffect } from "react";

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
const KeyFilter: React.FC<KeyFilterProps> = ({
  onClose,
  selectedKeys,
  setSelectedKeys,
  selectedScale,
  setSelectedScale,
  setKeyFilterCombinations,
}) => {
  const [selectedAccidental, setSelectedAccidental] = useState<string>("Flat");
  const [includeRelativeScales, setIncludeRelativeScales] =
    useState<boolean>(false);

  /* Scales and Key */
  const scales = ["Major", "Minor"];
  const accidentals = ["Flat", "Sharp"];

  const handleincludeRelativeScalesChange = () => {
    setIncludeRelativeScales(!includeRelativeScales);
  };

  /* White Keys Map*/
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];

  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
  };

  /* Black Keys Map*/
  const blackSharpKeys = ["C#", "D#", "F#", "G#", "A#"];
  const blackFlatKeys = ["Db", "Eb", "Gb", "Ab", "Bb"];
  const getFlatOrSharp = () => {
    return selectedAccidental === "Flat" ? blackFlatKeys : blackSharpKeys;
  };

  const selectedBlackKeysArray = getFlatOrSharp();
  const firstTwoBlackKeys = selectedBlackKeysArray.slice(0, 2);
  const lastThreeBlackKeys = selectedBlackKeysArray.slice(2);

  const handleKeyChange = (key: string) => {
    if (blackFlatKeys.includes(key)) {
      setSelectedAccidental("Flat");
      setSelectedKeys(key);
    } else if (blackSharpKeys.includes(key)) {
      setSelectedAccidental("Sharp");
      setSelectedKeys(key);
    } else {
      // Handle the case when a white key is clicked, keep the current accidental selected
      setSelectedKeys(key);
    }
  };

  const handleAccidentalChange = (accidental: string) => {
    setSelectedAccidental(accidental);

    // Update the selected key to its equivalent flat or sharp if applicable
    if (accidental === "Flat" && blackSharpKeys.includes(selectedKeys)) {
      const flatEquivalent = getFlatEquivalent(selectedKeys);
      setSelectedKeys(flatEquivalent);
    } else if (accidental === "Sharp" && blackFlatKeys.includes(selectedKeys)) {
      const sharpEquivalent = getSharpEquivalent(selectedKeys);
      setSelectedKeys(sharpEquivalent);
    }
  };

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

  /* Generate Key Combinations */

  /* Button Clicks */
  useEffect(() => {
    const majorToMinorMap: { [key: string]: string } = {
      C: "A",
      "C#": "A#",
      D: "B",
      "D#": "C",
      E: "C#",
      F: "D",
      "F#": "D#",
      G: "E",
      "G#": "F",
      A: "F#",
      "A#": "G",
      B: "G#",
      Db: "Bb",
      Eb: "C",
      Gb: "Eb",
      Ab: "F",
      Bb: "G",
    };

    // Invert the key-value pairs of majorToMinorMap to create minorToMajorMap
    const minorToMajorMap: { [key: string]: string } = {};
    for (const majorKey in majorToMinorMap) {
      const minorKey = majorToMinorMap[majorKey];
      minorToMajorMap[minorKey] = majorKey;
    }

    const getRelativeScale = (key: string, isMajor: boolean) => {
      return isMajor ? majorToMinorMap[key] : minorToMajorMap[key];
    };

    /* Relative Scales */
    const addKeyAndRelativeScale = (
      key: string,
      selectedScale: string,
      includeRelativeScales: boolean
    ) => {
      const addCombination = (keyNote: string, scaleType: string) => {
        if (keyNote) {
          result.push({
            key: `${keyNote} ${scaleType}`,
            "key.note": keyNote,
            "key.scale": scaleType,
          });
        }
      };

      const result: {
        key: string;
        "key.note": string | null;
        "key.scale": string | null;
      }[] = [];

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

      // Add combinations for enharmonic equivalents of the selected key
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

    const combinationsArray = addKeyAndRelativeScale(
      selectedKeys,
      selectedScale,
      includeRelativeScales
    );

    // Inside generateKeyCombinations function
    const generateKeyCombinations = (
      selectedKeys: string,
      selectedAccidental: string,
      selectedScale: string,
      includeRelativeScales: boolean
    ) => {
      const result = new Set<{
        key: string | null;
        "key.note": string | null;
        "key.scale": string | null;
      }>(); // Use a Set to store unique combinations

      if (selectedKeys) {
        // Add the selected key with its relative scale
        const combinations1 = addKeyAndRelativeScale(
          selectedKeys,
          selectedScale,
          includeRelativeScales
        );
        combinations1.forEach((combination) => result.add(combination)); // Add combinations to Set

        // Find the equivalent key (sharp or flat) and add it with its relative scale
        const equivalentKey =
          selectedAccidental === "Flat"
            ? getFlatEquivalent(selectedKeys)
            : getSharpEquivalent(selectedKeys);
        const combinations2 = addKeyAndRelativeScale(
          equivalentKey,
          selectedScale,
          includeRelativeScales
        );
        combinations2.forEach((combination) => result.add(combination)); // Add combinations to Set
      }

      return Array.from(result);
    };

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

  const handleClearClick = () => {
    setSelectedKeys("");
    setIncludeRelativeScales(false);
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div>
      {/* Desktop Filter */}
      <div className="hidden md:block z-10 absolute top-16 bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-8 shadow rounded-lg text-neutral-300 text-xs">
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
            className="font-medium text-xs rounded-full mr-3 text-neutral-50 bg-blue-500 dark:bg-blue-700 px-6 py-1"
          >
            Close
          </button>
        </div>
      </div>
      {/* Mobile Filter */}
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
