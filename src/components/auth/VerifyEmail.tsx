"use client";
import React from "react";

const VerifyEmail: React.FC = () => {
  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <p className="text-sm text-gray-500 w-full text-center">Message</p>
      <button
        className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm p-2 rounded-md cursor-pointer`}
      >
        Resend Email
      </button>
    </div>
  );
};

export default VerifyEmail;
