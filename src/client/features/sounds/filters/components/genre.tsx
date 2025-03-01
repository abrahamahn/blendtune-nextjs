import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@core/store';
import {
  selectGenres,
  selectCategory,
  removeAllGenres,
} from "@store/slices";
import {
  faStar,
  faGem,
  faWater,
  faLeaf,
  faPaw,
  faBoltLightning,
  faGlobe, // Added icon for "All"
} from "@fortawesome/free-solid-svg-icons";
import { FilterWrapper, Item, ActionButtons } from "@sounds/filters/ui";

/**
* Props for GenreFilter component
*/
interface GenreFilterProps {
 selectedGenres: string[];
 onClose: () => void;
}

/**
* Available genre options with icons - Added "All" option
*/
const genreItems = [
 { icon: faGlobe, text: "All" }, // Added All option
 { icon: faStar, text: "Pop" },
 { icon: faGem, text: "Hiphop" },
 { icon: faWater, text: "R&B" },
 { icon: faLeaf, text: "Latin" },
 { icon: faPaw, text: "Afrobeat" },
 { icon: faBoltLightning, text: "Electronic" },
];

/**
* Genre filter component with responsive layout
* Fixed to include "All" option and use original working logic
*/
const GenreFilter: React.FC<GenreFilterProps> = ({
 selectedGenres,
 onClose,
}) => {
 const dispatch = useDispatch();
 const selectedCategory = useSelector(
   (state: RootState) => state.tracks.selected.category
 );

 /**
  * Uses original working logic for genre toggling
  */
 const handleGenreToggle = (genre: string) => {
   if (genre === "All") {
     // Original working logic - use removeAllGenres for "All"
     dispatch(removeAllGenres());
   } else {
     // Original working logic - use selectCategory for specific genres
     dispatch(selectCategory(genre));
   }
 };

 /**
  * Uses original clear function
  */
 const handleClearGenres = () => {
   dispatch(removeAllGenres());
 };

 /**
  * Determines if a genre is selected
  */
 const isGenreSelected = (genre: string) => {
   if (genre === "All") {
     return selectedCategory === "All";
   }
   return selectedGenres.includes(genre);
 };

 return (
   <div>
     {/* Desktop Filter Panel */}
     <FilterWrapper 
       isDesktop={true}
       className="top-0 absolute bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-2 shadow rounded-lg text-neutral-300 text-xs"
     >
       <div className="grid grid-cols-2 gap-2">
         {genreItems.map((item, index) => (
           <Item
             key={index}
             variant="filter"
             size="sm"
             selected={isGenreSelected(item.text)}
             onClick={() => handleGenreToggle(item.text)}
             className="px-1.5 py-1.5"
           >
             <div className="flex items-center justify-center w-4 mr-1">
               <FontAwesomeIcon
                 icon={item.icon}
                 className="justify-center items-center mt-0.5"
               />
             </div>
             <p>{item.text}</p>
           </Item>
         ))}
       </div>
       
       {/* Desktop Control Buttons */}
       <ActionButtons 
         onClear={handleClearGenres}
         onClose={onClose}
       />
     </FilterWrapper>

     {/* Mobile Filter Panel */}
     <FilterWrapper 
       isDesktop={false}
       className="z-10 top-12 py-4 px-2 text-neutral-300 text-sm"
     >
       <div className="grid grid-cols-3 gap-2">
         {genreItems.map((item, index) => (
           <Item
             key={index}
             variant="filter"
             size="md"
             selected={isGenreSelected(item.text)}
             onClick={() => handleGenreToggle(item.text)}
             className="px-3 py-2"
           >
             <div className="flex items-center justify-center w-5 mr-2">
               <FontAwesomeIcon
                 icon={item.icon}
                 size="lg"
                 className="justify-center items-center mt-0.5"
               />
             </div>
             <p>{item.text}</p>
           </Item>
         ))}
       </div>

       {/* Mobile Clear Button */}
       <ActionButtons 
         onClear={handleClearGenres}
         isMobile={true}
       />
     </FilterWrapper>
   </div>
 );
};

export default GenreFilter;