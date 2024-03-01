"use client";
import React, { useEffect } from "react";
import Logo from "@/components/shared/common/Logo";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import LoadingIcon from "@/components/shared/common/LoadingIcon";

const PasswordReset: React.FC = () => {
  const router = useRouter();
  const { authenticated } = useSession();

  useEffect(() => {
    if (authenticated) {
      const timer = setTimeout(() => {
        router.push("/sounds");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authenticated, router]);

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 py-8">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 py-8">
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
