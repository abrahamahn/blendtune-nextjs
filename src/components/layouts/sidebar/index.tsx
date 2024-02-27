"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { selectCategory, removeAllGenres } from "@/redux/trackSlices/keyword";
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
const SideBar: React.FC = () => {
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

  const pageItems = [
    { icon: faFile, text: "Pricing" },
    { icon: faCircleInfo, text: "Support" },
    { icon: faUpload, text: "Submit" },
  ];

  const handleSoundsClick = () => {
    dispatch(removeAllGenres());
    router.push("/sounds");
  };

  const handleGenreItemClick = (genre: string) => {
    if (genre === "All") {
      dispatch(removeAllGenres());
      router.push("/sounds");
    } else {
      dispatch(selectCategory(genre));
      router.push("/sounds");
    }
  };

  return (
    <header>
      <div className="hidden md:block fixed md:w-20 h-full bg-neutral-200 dark:bg-black text-white p-2">
        <div className=" bg-white dark:bg-neutral-950 rounded-xl">
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
        <div className="mt-2 bg-white dark:bg-neutral-950 rounded-xl">
          <div className="flex flex-col pt-1 text-neutral-600 dark:text-neutral-300">
            <div className="flex flex-col justify-center items-center pt-1 text-neutral-600 dark:text-neutral-300">
              <button
                onClick={() => handleSoundsClick()}
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
                  <p className="mt-2 text-2xs">{genre.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 bg-white dark:bg-neutral-950 rounded-xl">
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
      </div>
    </header>
  );
};

export default SideBar;
