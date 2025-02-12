import { useState } from "react";

const useAuthModal = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [form, setForm] = useState("signin");

  const openSignInModal = () => {
    setAuthModalOpen(false);
    setForm("signin");
    setAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthModalOpen(false);
    setForm("signup");
    setAuthModalOpen(true);
    console.log("Auth modal opened: ", authModalOpen);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(true);
    setAuthModalOpen(false);
    console.log("Auth modal closed: ", !authModalOpen);
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
