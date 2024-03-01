import React, { useState } from "react";
import Logo from "@/components/shared/common/Logo";
import LoadingIcon from "@/components/shared/common/LoadingIcon";

interface ResetPasswordProps {
  openSignIn: () => void;
  openVerifyEmail: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  openSignIn,
  openVerifyEmail,
}) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/security/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        openVerifyEmail();
      } else {
        setErrorMessage(data.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:px-8 py-8">
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          <div className="flex flex-col items-center mt-8">
            <h1 className="flex text-base font-semibold text-black dark:text-white">
              Forgot Your Password?
            </h1>
          </div>
          <div className="w-full mt-4 lg:mt-0">
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="lg:mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-500 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md hover:border-blue-500"
            />
          </div>
          {errorMessage ? (
            <p className="texts-left text-red-500 text-xs mt-2">
              {errorMessage}
            </p>
          ) : (
            <p className="text-left text-neutral-500 dark:text-gray-500 text-2xs mt-3">
              Please enter an email address you have registered. We will send
              you a confirmation email for verification.
            </p>
          )}
          <div>
            {" "}
            {/* Add a closing div tag here */}
            <button
              onClick={handleResetPassword}
              className="w-full mt-6 h-10 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-700"
            >
              {isLoading ? <LoadingIcon /> : "Continue"}
            </button>
          </div>{" "}
          {/* Close the div here */}
          <div className="text-blue-500 text-sm mt-4">
            <a
              onClick={openSignIn}
              className="cursor-pointer hover:opacity-80 text-xs"
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
