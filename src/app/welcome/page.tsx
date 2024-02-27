// Welcome component
"use client";
import React from "react";
import { useSession } from "@/context/SessionContext";

const Welcome = () => {
  const { authenticated, status, userEmail, userFirstName, userLastName } =
    useSession();

  // Determine the online/offline status message
  let statusMessage = "offline";
  if (status) {
    statusMessage = "online";
  }

  // Determine the authentication status message
  let authMessage = "not authenticated";
  if (authenticated) {
    authMessage = "authenticated";
  }

  return (
    <div className="h-screen w-full flex">
      <p className="w-full flex justify-center items-center dark:text-white text-black">
        Welcome, {userFirstName || "Guest"} {userLastName || ""}! You are now{" "}
        {statusMessage}! You are {authMessage} Your login ID is {userEmail} and
        now you are {statusMessage}!
      </p>
    </div>
  );
};

export default Welcome;
