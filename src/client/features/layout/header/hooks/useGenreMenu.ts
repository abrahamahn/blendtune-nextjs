// src\client\features\layout\header\hooks\useGenreMenu.ts
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { selectCategory, removeAllGenres } from "@/client/features/sounds/filters/store/filterSlice";
import { 
 faStar, 
 faGem, 
 faWater, 
 faLeaf, 
 faPaw, 
 faBoltLightning 
} from "@fortawesome/free-solid-svg-icons";

/**
* Custom hook for managing genre menu interactions and navigation.
* Provides menu items with icons and handles genre selection routing.
*/

const useGenreMenu = () => {
 const router = useRouter();
 const dispatch = useDispatch();

 // Map of genre menu items with their associated icons
 const genreItems = [
   { icon: faStar, text: "Pop" },
   { icon: faGem, text: "Hiphop" },
   { icon: faWater, text: "R&B" },
   { icon: faLeaf, text: "Latin" },
   { icon: faPaw, text: "Afrobeat" },
   { icon: faBoltLightning, text: "Electronic" },
 ];

 // Handles genre selection and navigation to sounds page
 const handleGenreItemClick = (genre: string) => {
   if (genre === "All") {
     dispatch(removeAllGenres());
     router.push("/sounds");
   } else {
     dispatch(selectCategory(genre));
     router.push("/sounds");
   }
 };

 return { genreItems, handleGenreItemClick };
};

export default useGenreMenu;