import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  selectKeywords,
  deselectKeyword,
  removeAllKeywords,
} from "@/redux/trackSlices/keyword";

interface KeywordFilterProps {
  keywords: string[];
  onClose: () => void;
  selectedKeywords: string[];
}

const KeywordFilter: React.FC<KeywordFilterProps> = ({
  keywords,
  onClose,
  selectedKeywords,
}) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const handleKeywordToggle = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      dispatch(deselectKeyword(keyword));
    } else {
      dispatch(selectKeywords([keyword]));
    }
  };

  const searchResult = keywords
    .filter((keyword) =>
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort();

  const handleClearClick = () => {
    dispatch(removeAllKeywords());
    setSearchTerm("");
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div>
      {/*Desktop Filter*/}
      <div className="hidden md:block z-10 top-12 absolute bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-2 shadow rounded-lg text-neutral-300 text-xs">
        <div className="w-full flex flex-row mb-4">
          <input
            type="text"
            placeholder="Search Keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs h-8 rounded-lg bg-white/95 dark:bg-black/90 border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
          />
        </div>
        <div className="w-[480px] border rounded-md border-neutral-400 dark:border-neutral-700 grid grid-cols-3 gap-0 overflow-y-auto h-72 scrollbar">
          {searchResult.map((keyword, index) => (
            <button
              key={index}
              className={`mb-0 items-center hover:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 ${
                selectedKeywords.includes(keyword)
                  ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                  : "bg-white/90 dark:bg-black/90 text-neutral-600 dark:text-neutral-300"
              }`}
              onClick={() => handleKeywordToggle(keyword)}
            >
              <p className="ml-1">{keyword}</p>
            </button>
          ))}
        </div>
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
      {/*Mobile Filter*/}
      <div className="block md:hidden z-10 py-4 px-2 text-neutral-300 text-xs">
        <div className="w-full flex flex-row mb-4">
          <input
            type="text"
            placeholder="Search Keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs h-8 rounded-lg bg-white/95 dark:bg-black/90 border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
          />
        </div>
        <div className="w-[340px] h-28 border rounded-md border-neutral-400 dark:border-neutral-700  grid grid-cols-3 gap-0 overflow-y-auto max-h-72">
          {searchResult.map((keyword, index) => (
            <button
              key={index}
              className={`mb-0 items-center hover:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 ${
                selectedKeywords.includes(keyword)
                  ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
              onClick={() => handleKeywordToggle(keyword)}
            >
              <p className="ml-1">{keyword}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearClick}
            className="font-medium text-sm rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeywordFilter;
