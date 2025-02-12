import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { removeAllGenres } from "@/client/environment/redux/slices/keyword";

const useMobileMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSoundsClick = () => {
    dispatch(removeAllGenres());
    router.push("/sounds");
    setIsMobileMenuOpen(false);
  };

  return {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    handleSoundsClick,
  };
};

export default useMobileMenu;
