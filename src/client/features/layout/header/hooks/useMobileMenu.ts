// src\client\features\layout\header\hooks\useMobileMenu.ts

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { removeAllGenres } from "@store/slices";

/**
* Custom hook for mobile menu functionality
* @returns Menu state and handlers
*/
const useMobileMenu = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const router = useRouter();
 const dispatch = useDispatch();

 /**
  * Opens the mobile menu
  */
 const openMobileMenu = () => {
   setIsMobileMenuOpen(true);
 };

 /**
  * Closes the mobile menu
  */
 const closeMobileMenu = () => {
   setIsMobileMenuOpen(false);
 };

 /**
  * Handles navigation to sounds page
  * Clears genre filters and closes menu
  */
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

export { useMobileMenu };