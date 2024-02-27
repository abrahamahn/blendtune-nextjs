import React from "react";

interface SortFilterProps {
  openSortFilter: boolean;
  mobileFilterOpen: boolean;
  sortBy: string | null;
  handleSortChange: (option: string) => void;
  handleMobileSortChange: (option: string) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({
  openSortFilter,
  mobileFilterOpen,
  sortBy,
  handleSortChange,
  handleMobileSortChange,
}) => {
  return (
    <div>
      {openSortFilter && (
        <div className="hidden md:block z-20 absolute mt-[-340px] top-90 right-30 w-32 bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 px-2 shadow rounded-lg text-neutral-300 text-xs">
          <div
            className="py-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className={`${sortBy === "Newest" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleSortChange("Newest")}
            >
              Newest
            </button>
            <button
              className={`${sortBy === "Oldest" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleSortChange("Oldest")}
            >
              Oldest
            </button>
            <button
              className={`${sortBy === "Random" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleSortChange("Random")}
            >
              Random
            </button>
            <button
              className={`${sortBy === "A-Z" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleSortChange("A-Z")}
            >
              A-Z
            </button>
          </div>
        </div>
      )}
      {mobileFilterOpen && (
        <div className="block md:hidden z-20 absolute top-28 right-4 w-32 shadow-lg bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 px-2 rounded-lg text-neutral-300 p-1">
          <div
            className="py-1.5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className={`${sortBy === "Newest" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-2 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleMobileSortChange("Newest")}
            >
              Newest
            </button>
            <button
              className={`${sortBy === "Oldest" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-2 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleMobileSortChange("Oldest")}
            >
              Oldest
            </button>
            <button
              className={`${sortBy === "Random" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-2 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleMobileSortChange("Random")}
            >
              Random
            </button>
            <button
              className={`${sortBy === "A-Z" ? "text-neutral-600 dark:text-neutral-50" : "text-neutral-600 dark:text-neutal-300"} block w-full text-left px-2 py-1.5 text-xs text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500`}
              role="menuitem"
              onClick={() => handleMobileSortChange("A-Z")}
            >
              A-Z
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilter;
