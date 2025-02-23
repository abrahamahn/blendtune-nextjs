// src\client\features\sounds\category\components\Category.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@core/store';
import {
  selectCategory,
  removeAllGenres,
} from "@store/slices";

const Category: React.FC = () => {
  const dispatch = useDispatch();
  const selectedGenres = useSelector(
    (state: RootState) => state.tracks.selected.genres
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.selected.category
  );

  const genreItems = [
    "All",
    "Pop",
    "Hiphop",
    "R&B",
    "Latin",
    "Afrobeat",
    "Electronic",
  ];

  const handleGenreItemClick = (genre: string) => {
    if (genre === "All") {
      dispatch(removeAllGenres());
    } else {
      dispatch(selectCategory(genre));
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto md:px-2 lg:px-2 px-4 sm:pt-4 md:pt-0 lg:p-2">
      <div className="flex flex-row justify-start items-start w-full border-b border-neutral-200 dark:border-neutral-700 overflow-x-scroll">
        {genreItems.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreItemClick(genre)}
            className={`flex justify-center items-center text-sm mr-2 py-1 px-2 ${
              (selectedCategory.includes("All") && genre === "All") ||
              selectedCategory.includes(genre)
                ? "text-neutral-500 dark:text-neutral-100 border-b-2 border-neutral-600 dark:border-neutral-100"
                : "text-neutral-600 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-200 border-b border-transparent"
            }`}
          >
            <p>{genre}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;
