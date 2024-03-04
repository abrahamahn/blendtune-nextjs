import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectGenres, removeAllGenres } from "@/redux/trackSlices/keyword";

import {
  faStar,
  faGem,
  faWater,
  faLeaf,
  faPaw,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";

interface GenreFilterProps {
  selectedGenres: string[];
  onClose: () => void;
}

const genreItems = [
  { icon: faStar, text: "Pop" },
  { icon: faGem, text: "Hiphop" },
  { icon: faWater, text: "R&B" },
  { icon: faLeaf, text: "Latin" },
  { icon: faPaw, text: "Afrobeat" },
  { icon: faBoltLightning, text: "Electronic" },
];

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  onClose,
}) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.selected.category
  );
  const handleGenreToggle = (genre: string) => {
    dispatch(selectGenres(genre));
  };

  const handleClearClick = () => {
    dispatch(removeAllGenres());
  };

  const handleCloseClick = () => {
    onClose();
  };
  return (
    <div>
      {/* Desktop Filter */}
      <div className="hidden md:block top-16 absolute bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-2 shadow rounded-lg text-neutral-300 text-xs">
        <div className="grid grid-cols-2 gap-2">
          {genreItems.map((item, index) => (
            <button
              key={index}
              className={`mb-0 text-neutral-500 dark:text-neutral-200 
              hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg flex flex-row px-1.5 py-1.5 ${
                selectedGenres.includes(item.text)
                  ? "bg-blue-600 text-white"
                  : "hover:text-neutral-200 bg-white/90 dark:bg-black/90 text-neutral-500 border border-neutral-200 dark:border-transparent"
              }`}
              onClick={() => handleGenreToggle(item.text)}
            >
              <div className="flex items-center justify-center w-4">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="justify-center items-center mt-0.5"
                />
              </div>
              <p className="ml-1">{item.text}</p>
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
      {/* Mobile Filter */}
      <div className="z-10 block md:hidden top-12 py-4 px-2 text-neutral-300 text-sm">
        <div className="grid grid-cols-3 gap-2">
          {genreItems.map((item, index) => (
            <button
              key={index}
              className={`mb-0 text-neutral-500 dark:text-neutral-200 
              hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg flex flex-row px-3 py-2 ${
                selectedGenres.includes(item.text)
                  ? "bg-blue-600 text-white"
                  : "hover:text-neutral-200 bg-white/90 dark:bg-black/90 text-neutral-500 border border-neutral-200 dark:border-transparent"
              }`}
              onClick={() => handleGenreToggle(item.text)}
            >
              <div className="flex items-center justify-center w-5">
                <FontAwesomeIcon
                  icon={item.icon}
                  size="lg"
                  className="justify-center items-center mt-0.5 mr-2"
                />
              </div>
              <p className="ml-1">{item.text}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearClick}
            className="font-medium rounded-full mr-3 text-neutral-500 dark:text-neutral-50  bg-transparent underline py-1 text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreFilter;
