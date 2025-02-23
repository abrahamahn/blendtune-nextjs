// src/app/auth/security/reset-confirmed/page.tsx
"use client";

import React, { useEffect } from "react";
import Logo from "@components/common/Logo";
import { useRouter } from "next/navigation";
import { useSession } from "@auth/services";
import LoadingIcon from "@components/common/LoadingIcon";

/**
 * PasswordReset component:
 * - Displays a confirmation message after a successful password reset.
 * - Automatically redirects the user to the main page after a short delay.
 */
const PasswordReset: React.FC = () => {
  const router = useRouter();
  const { userAuthenticated } = useSession();

  useEffect(() => {
    if (userAuthenticated) {
      const timer = setTimeout(() => {
        router.push("/sounds");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userAuthenticated, router]);

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 py-8">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 py-8">
          {/* Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          <p className="text-left text-neutral-600 dark:text-gray-200 text-xs mt-3">
            Your password has been successfully changed! Now logging in...
          </p>
          <div className="flex justify-center items-center w-full mt-6 h-10 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-700">
            <LoadingIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
