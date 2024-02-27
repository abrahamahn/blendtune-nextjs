"use client";
import React from "react";
import Link from "next/link";
import Logo from "@/components/shared/common/Logo";

const ResetPassword: React.FC = () => {
  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:py-8">
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Forgot Your Password?
            </h1>
          </div>
          <div className="w-full">
            <input
              type="email"
              placeholder="Email Address"
              className="lg:mt-4 w-full bg-transparent text-gray-400 text-sm border-gray-500 p-3 rounded-md hover:border-blue-500"
            />
          </div>
          <div>
            {" "}
            {/* Add a closing div tag here */}
            <Link
              href="/auth/verify-email"
              className="w-full mt-6 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-700"
            >
              Continue
            </Link>
          </div>{" "}
          {/* Close the div here */}
          <div className="text-blue-500 text-sm mt-4">
            <Link
              href="/auth/signin"
              className="cursor-pointer hover:opacity-80 text-xs"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
