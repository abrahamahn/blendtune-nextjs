import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { selectCategory, removeAllGenres } from "@/client/environment/redux/slices/keyword";
import { faStar, faGem, faWater, faLeaf, faPaw, faBoltLightning } from "@fortawesome/free-solid-svg-icons";

const useGenreMenu = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const genreItems = [
    { icon: faStar, text: "Pop" },
    { icon: faGem, text: "Hiphop" },
    { icon: faWater, text: "R&B" },
    { icon: faLeaf, text: "Latin" },
    { icon: faPaw, text: "Afrobeat" },
    { icon: faBoltLightning, text: "Electronic" },
  ];

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