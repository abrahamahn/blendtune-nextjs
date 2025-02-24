import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@core/store';
import { selectGenres, removeAllGenres } from "@store/slices";
import {
 faStar,
 faGem,
 faWater,
 faLeaf,
 faPaw,
 faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import { FilterWrapper } from "../shared/ui/FilterWrapper";
import { FilterGrid } from "../shared/ui/FilterGrid";
import { Button } from "../shared/ui/Button";
import { ActionButtons } from "../shared/ui/ActionButtons";

/**
* Props for GenreFilter component
*/
interface GenreFilterProps {
 selectedGenres: string[];
 onClose: () => void;
}

/**
* Available genre options with icons
*/
const genreItems = [
 { icon: faStar, text: "Pop" },
 { icon: faGem, text: "Hiphop" },
 { icon: faWater, text: "R&B" },
 { icon: faLeaf, text: "Latin" },
 { icon: faPaw, text: "Afrobeat" },
 { icon: faBoltLightning, text: "Electronic" },
];

/**
* Genre filter component with responsive layout
* Provides genre selection and filtering functionality
*/
const GenreFilter: React.FC<GenreFilterProps> = ({
 selectedGenres,
 onClose,
}) => {
 const dispatch = useDispatch();

 /**
  * Handles genre selection/deselection
  */
 const handleGenreToggle = (genre: string) => {
   dispatch(selectGenres(genre));
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
           <Button
             key={index}
             variant="filter"
             size="sm"
             selected={selectedGenres.includes(item.text)}
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
           </Button>
         ))}
       </div>
       
       {/* Desktop Control Buttons */}
       <ActionButtons 
         onClear={() => dispatch(removeAllGenres())}
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
           <Button
             key={index}
             variant="filter"
             size="md"
             selected={selectedGenres.includes(item.text)}
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
           </Button>
         ))}
       </div>

       {/* Mobile Clear Button */}
       <ActionButtons 
         onClear={() => dispatch(removeAllGenres())}
         isMobile={true}
       />
     </FilterWrapper>
   </div>
 );
};

export default GenreFilter;