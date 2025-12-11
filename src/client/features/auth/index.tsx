// src\client\features\auth\index.tsx
/**
 * @fileoverview Authentication modal component managing different auth forms
 */

import React, { useState } from "react";
import SignIn from "@auth/components/SignInForm";
import SignUp from "@auth/components/SignUpForm";
import ResetPassword from "@auth/components/ResetPasswordForm";
import VerifyEmail from "@auth/components/VerifyEmailForm";

type AuthFormType = "signin" | "signup" | "resetpassword" | "confirmsignup" | "confirmresetpw";

/**
 * Props for the authentication modal
 */
interface AuthModalProps {
  closeAuthModal: () => void;
  form?: string;
  setForm: (form: string) => void;
}

/**
 * Props for email verification configuration
 */
interface EmailApiProps {
  mode: "signup" | "resetPassword";
  apiEndpoint: string;
  initialMessage: string;
}

/**
 * Authentication modal component handling all auth-related forms
 */
const AuthModal: React.FC<AuthModalProps> = ({
  closeAuthModal,
  form = "signup",
  setForm,
}) => {
  // State for user email across different forms
  const [userEmail, setUserEmail] = useState("");

  // Form navigation handlers
  const openSignIn = () => setForm("signin");
  const openSignUp = () => setForm("signup");
  const openResetPassword = () => setForm("resetpassword");
  const openConfirmEmail = () => setForm("confirmsignup");
  const openVerifyEmail = () => setForm("confirmresetpw");

  /**
   * Prevents modal close when clicking modal content
   */
  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // Email verification configurations
  const verifyEmailSignupProps: EmailApiProps = {
    mode: "signup",
    apiEndpoint: "/api/auth/security/confirm-email",
    initialMessage:
      "Please confirm your email by going to your inbox and clicking on the confirmation link.",
  };

  const verifyEmailResetPasswordProps: EmailApiProps = {
    mode: "resetPassword",
    apiEndpoint: "/api/auth/security/reset-password/verify",
    initialMessage: "Please check your email to reset your password.",
  };

  // Map of form types to their respective components
  const modalMap: Record<string, React.ReactElement> = {
    signin: (
      <SignIn
        openSignUp={openSignUp}
        openResetPassword={openResetPassword}
        openConfirmEmail={openConfirmEmail}
        closeAuthModal={closeAuthModal}
      />
    ),
    signup: (
      <SignUp
        openSignIn={openSignIn}
        openConfirmEmail={openConfirmEmail}
        email={userEmail}
        setEmail={setUserEmail}
      />
    ),
    resetpassword: (
      <ResetPassword
        openSignIn={openSignIn}
        openVerifyEmail={openVerifyEmail}
      />
    ),
    confirmsignup: (
      <VerifyEmail userEmail={userEmail} {...verifyEmailSignupProps} />
    ),
    confirmresetpw: (
      <VerifyEmail userEmail={userEmail} {...verifyEmailResetPasswordProps} />
    ),
  };

  // Default to SignUp if form type is invalid
  const modalContent = modalMap[form] || (
    <SignUp
      openSignIn={openSignIn}
      openConfirmEmail={openConfirmEmail}
      email={userEmail}
      setEmail={setUserEmail}
    />
  );

  return (
    <div
      onClick={closeAuthModal}
      className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-opacity-60 bg-black z-40"
    >
      <div
        onClick={handleModalContentClick}
        className={`${
          form === "signin" ||
          form === "resetpassword" ||
          form === "verifyemail"
            ? "bg-gray-900"
            : "bg-gray-900"
        } w-80 p-4 rounded-lg border border-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50`}
      >
        {modalContent}
      </div>
    </div>
  );
};

export default AuthModal;