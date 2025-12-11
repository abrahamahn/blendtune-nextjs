// src\client\features\layout\leftbar\index.tsx
/**
* @fileoverview Left sidebar navigation component for main app layout
* @module layout/LeftBar
*/

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { selectCategory, removeAllGenres } from "@/client/features/sounds/filters/store/filterSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faHome,
 faMusic,
 faStar,
 faGem,
 faWater,
 faLeaf,
 faPaw,
 faBoltLightning,
 faFile,
 faCircleInfo,
 faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@auth/services/useSession";
import LeftBarSkeleton from "./components/LeftBarSkeleton";

/**
* Navigation item configuration type
*/
interface NavItem {
 icon: typeof faHome;
 text: string;
}

/**
* Left sidebar navigation component
* Provides navigation controls and genre filters
*/
const LeftBar: React.FC = () => {
 const router = useRouter();
 const dispatch = useDispatch();
 const { sessionLoading } = useSession();

 // Genre navigation items configuration
 const genreItems: NavItem[] = [
   { icon: faStar, text: "Pop" },
   { icon: faGem, text: "Hiphop" },
   { icon: faWater, text: "R&B" },
   { icon: faLeaf, text: "Latin" },
   { icon: faPaw, text: "Afrobeat" },
   { icon: faBoltLightning, text: "Electronic" },
 ];

 // Page navigation items configuration
 const pageItems: NavItem[] = [
   { icon: faFile, text: "Pricing" },
   { icon: faCircleInfo, text: "Support" },
   { icon: faUpload, text: "Submit" },
 ];

 if (sessionLoading) {
   return <LeftBarSkeleton />;
 }

 /**
  * Handles click on sounds navigation
  * Clears genre filters and navigates to sounds page
  */
 const handleSoundsClick = () => {
   dispatch(removeAllGenres());
   router.push("/sounds");
 };

 /**
  * Handles genre selection
  * Updates genre filter and navigates to sounds page
  * @param genre - Selected genre name
  */
 const handleGenreItemClick = (genre: string) => {
   if (genre === "All") {
     dispatch(removeAllGenres());
   } else {
     dispatch(selectCategory(genre));
   }
   router.push("/sounds");
 };

 return (
   <header>
     {/* Home navigation */}
     <div className="bg-white border dark:border-0 dark:bg-neutral-950 rounded-xl">
       <div className="flex flex-col pt-1 text-neutral-600 dark:text-neutral-300">
         <Link
           href="./"
           className="flex flex-col justify-center items-center p-3"
         >
           <FontAwesomeIcon icon={faHome} size="lg" />
           <p className="mt-2 text-2xs">Home</p>
         </Link>
       </div>
     </div>

     {/* Genre navigation */}
     <div className="mt-2 bg-white border dark:border-0 dark:bg-neutral-950 rounded-xl">
       <div className="flex flex-col pt-1 text-neutral-600 dark:text-neutral-300">
         <div className="flex flex-col justify-center items-center pt-1 text-neutral-600 dark:text-neutral-300">
           <button
             onClick={handleSoundsClick}
             className="flex flex-col justify-center items-center p-3"
           >
             <FontAwesomeIcon icon={faMusic} size="lg" />
             <p className="mt-2 text-2xs">Sounds</p>
           </button>
           {genreItems.map((genre) => (
             <button
               key={genre.text}
               onClick={() => handleGenreItemClick(genre.text)}
               className="flex flex-col justify-center items-center py-3"
             >
               <FontAwesomeIcon icon={genre.icon} size="lg" />
               <p className="text-2xs">{genre.text}</p>
             </button>
           ))}
         </div>
       </div>
     </div>

     {/* Page navigation */}
     <div className="mt-2 bg-white border dark:border-0 dark:bg-neutral-950 rounded-xl">
       <div className="flex flex-col pt-1 text-neutral-600 dark:text-neutral-300">
         <div className="flex flex-col justify-center items-center pt-1 text-neutral-600 dark:text-neutral-300">
           {pageItems.map((page) => (
             <Link
               href={`/${page.text.toLowerCase()}`}
               key={page.text}
               className="flex flex-col justify-center items-center py-3"
             >
               <FontAwesomeIcon icon={page.icon} size="lg" />
               <p className="mt-2 text-2xs">{page.text}</p>
             </Link>
           ))}
         </div>
       </div>
     </div>
   </header>
 );
};

export default LeftBar;