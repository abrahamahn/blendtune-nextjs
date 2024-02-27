import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import ConfirmSignUp from "./ConfirmSignUp";

interface AuthModalProps {
  closeAuthModal: () => void;
  form?: string;
  setForm: (form: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  closeAuthModal,
  form = "signup",
  setForm,
}) => {
  const [userEmail, setUserEmail] = useState("");

  const openSignIn = () => {
    setForm("signin");
  };

  const openSignUp = () => {
    setForm("signup");
  };

  const openResetPassword = () => {
    setForm("resetpassword");
  };

  const openVerifyEmail = () => {
    setForm("verifyemail");
  };

  const openConfirmSignUp = () => {
    setForm("confirmsignup");
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const modalMap: Record<string, React.ReactElement> = {
    signin: (
      <SignIn openSignUp={openSignUp} openResetPassword={openResetPassword} />
    ),
    signup: (
      <SignUp
        openSignIn={openSignIn}
        openConfirmSignUp={openConfirmSignUp}
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
    verifyemail: <VerifyEmail />,
    confirmsignup: <ConfirmSignUp userEmail={userEmail} />,
  };

  const modalContent = modalMap[form] || (
    <SignUp
      openSignIn={openSignIn}
      openConfirmSignUp={openConfirmSignUp}
      email={userEmail}
      setEmail={setUserEmail}
    />
  );

  return (
    <div
      onClick={closeAuthModal}
      className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-opacity-60 bg-black z-20"
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
