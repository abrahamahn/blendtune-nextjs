// src\client\features\auth\hooks\useAuthModal.ts
/**
* @fileoverview Hook to manage authentication modal state and form display
*/

import { useState } from "react";

/**
* Form types for auth modal
*/
/**
* Custom hook for managing authentication modal functionality
* @returns Modal state and control methods
*/
const useAuthModal = () => {
 // Modal visibility state
 const [authModalOpen, setAuthModalOpen] = useState(false);
 
 // Current form type being displayed
 const [form, setForm] = useState("signin");

 /**
  * Opens sign in form
  * Resets and shows modal with signin form
  */
 const openSignInModal = () => {
   setAuthModalOpen(false);
   setForm("signin");
   setAuthModalOpen(true);
 };

 /**
  * Opens sign up form
  * Resets and shows modal with signup form
  */
 const openSignUpModal = () => {
   setAuthModalOpen(false);
   setForm("signup");
   setAuthModalOpen(true);
 };

 /**
  * Closes the auth modal
  * Uses double-toggle to ensure clean state
  */
 const closeAuthModal = () => {
   setAuthModalOpen(true);
   setAuthModalOpen(false);
 };

 return {
   authModalOpen,
   form,
   openSignInModal,
   openSignUpModal,
   closeAuthModal,
   setForm,
 };
};

export default useAuthModal;