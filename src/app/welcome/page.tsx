// src/app/welcome/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setArtistCreatorName,
  setGender,
  setUserType,
  setOccupation,
  setDateOfBirth,
  setMarketingConsent,
} from "@store/slices";
import { useSession } from "@auth/services";
import LoadingIcon from "@/client/shared/components/icons/LoadingIcon";
import WelcomeSkeleton from "./WelcomeSkeleton";

/**
 * Welcome Page Component:
 * - Gathers user information during onboarding.
 * - Dispatches user data to Redux for global state management.
 * - Sends profile data to the backend for account setup.
 */
const Welcome = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Retrieve user session data
  const {
    userArtistCreatorName,
    userGender,
    userDateOfBirth,
    userType,
    userOccupation,
    userMarketingConsent,
    sessionLoading,
  } = useSession();

  // Local states for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Parses a date string (YYYY-MM-DD) into an object with separate year, month, and day fields.
   * @param {string} dateString - The date string to parse.
   * @returns {object} - Parsed date with year, month, and day.
   */
  const parseDateOfBirth = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10),
    };
  };

  // Initialize date of birth state based on session data or default to the current year
  const initialDobState = userDateOfBirth
    ? parseDateOfBirth(userDateOfBirth)
    : { year: new Date().getFullYear(), month: 1, day: 1 };

  const [dobState, setDobState] = useState(initialDobState);

  // If session is still loading, show skeleton
  if (sessionLoading) {
    return <WelcomeSkeleton />;
  }

  /**
   * Updates the date of birth state when a user selects a new value.
   * @param {string} part - The part of the date (year, month, or day) being updated.
   * @param {string} value - The new value selected by the user.
   */
  const handleDobChange = (part: string, value: string) => {
    setDobState((prevState) => ({
      ...prevState,
      [part]: parseInt(value, 10),
    }));
  };

  /**
   * Toggles marketing email consent.
   * - Updates the Redux state to track whether the user has agreed to receive promotional emails.
   */
  const toggleMarketingButton = () => {
    dispatch(setMarketingConsent(!userMarketingConsent));
  };

  /**
   * Handles user profile submission.
   * - Validates user input and sends the profile data to the backend.
   * - Navigates the user to the `/sounds` page upon success.
   */
  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Format the date of birth as a string
    const dobString = `${dobState.year}-${String(dobState.month).padStart(2, "0")}-${String(dobState.day).padStart(2, "0")}`;

    try {
      // Dispatch the updated date of birth to Redux
      dispatch(setDateOfBirth(dobString));

      // Send profile update request to the backend
      const response = await fetch("/api/account/basic-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userArtistCreatorName,
          userType,
          userOccupation,
          userGender,
          userDateOfBirth: dobString,
          userMarketingConsent,
        }),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        router.push("/sounds");
      } else {
        setErrorMessage("An error occurred during profile update.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred during profile update.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Defines occupation types based on user type.
   * - If userType is "musician," provides music-related roles.
   * - Otherwise, provides creator-related roles.
   */
  const occupationTypes =
    userType === "musician"
      ? [
          "Rapper",
          "Singer",
          "Songwriter",
          "Music Producer",
          "Audio Engineer",
          "DJ",
          "Artist Manager",
          "Record Label",
          "Other",
        ]
      : [
          "Film/TV Producer",
          "Game Developer",
          "YouTuber",
          "Podcaster",
          "Corporate",
          "Event Planner",
          "Influencer",
          "Other",
        ];

  return (
    <div className="w-full h-full bg-opacity-80 bg-neutral-200 dark:bg-gray-900 rounded-xl flex justify-center items-center">
      <div className="w-96 rounded-lg bg-gray-500 dark:bg-gray-900 flex justify-center items-center">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:py-4">
          {/* Welcome header */}
          <div className="flex flex-col items-center p-4">
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Welcome to Blendtune!
            </h1>
            <p className="mt-4 text-xs text-neutral-200 dark:text-neutral-400">
              Please fill out the following information below to get started.
            </p>
          </div>

          {/* Signup form */}
          <form
            className="flex flex-col items-center w-full"
            onSubmit={handleProfileUpdate}
          >
            {/* Artist, Creator, or Organization Name */}
            <div className="flex flex-row w-full justify-center items-center relative">
              <input
                type="text"
                value={userArtistCreatorName || ""}
                onChange={(e) => dispatch(setArtistCreatorName(e.target.value))}
                placeholder=" "
                required
                className="h-12 bg-transparent text-neutral-600 dark:text-neutral-300 text-sm border-neutral-600 dark:border-gray-500 p-3 pr-10 rounded-md w-full appearance-none"
              />
              <label className="absolute left-3 top-0.5 text-xs text-neutral-600 dark:text-neutral-500">
                Artist, Creator, or Organization Name
              </label>
            </div>

            {/* User Type Selection */}
            <div className="flex flex-row w-full justify-center items-center mt-3 relative">
              <select
                value={userType || ""}
                onChange={(e) => dispatch(setUserType(e.target.value))}
                className="h-12 bg-transparent text-neutral-600 dark:text-neutral-300 text-sm border-neutral-600 dark:border-gray-500 p-3 pr-10 rounded-md w-full appearance-none"
                required
              >
                <option value="">Select</option>
                <option value="musician">Music Release</option>
                <option value="video creator">Content</option>
              </select>
              <label className="absolute left-3 top-0.5 text-xs text-neutral-600 dark:text-neutral-500">
                Using it for...
              </label>
            </div>

            {/* User Occupation Selection */}
            <div className="flex flex-row w-full justify-center items-center mt-3 relative">
              <select
                value={userOccupation || ""}
                onChange={(e) => dispatch(setOccupation(e.target.value))}
                className="h-12 bg-transparent text-neutral-600 dark:text-neutral-300 text-sm border-neutral-600 dark:border-gray-500 p-3 pr-10 rounded-md w-full appearance-none"
                required
              >
                <option value="">Select</option>
                {occupationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <label className="absolute left-3 top-0.5 text-xs text-neutral-600 dark:text-neutral-500">
                I am a...
              </label>
            </div>

            {/* Gender Selection */}
            <div className="flex flex-row w-full justify-center items-center mt-3 relative">
              <select
                onChange={(e) => dispatch(setGender(e.target.value))}
                value={userGender || ""}
                className="h-12 bg-transparent text-neutral-600 dark:text-neutral-300 text-sm border-neutral-600 dark:border-gray-500 p-3 pr-10 rounded-md w-full appearance-none"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label className="absolute left-3 top-0.5 text-xs text-neutral-600 dark:text-neutral-500">
                Gender
              </label>
            </div>

            {/* Date of Birth Selection */}
            <div className="flex flex-row w-full justify-center items-center mt-3 relative">
              <div className="flex flex-row w-full">
                {/* Month Selection */}
                <div className="relative w-1/4 mr-3">
                  <select
                    value={dobState.month}
                    onChange={(e) => handleDobChange("month", e.target.value)}
                    className="h-12 bg-transparent text-neutral-600 dark:text-neutral-300 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md w-full appearance-none"
                    required
                  >
                    <option value="">MM</option>
                    {[...Array(12).keys()].map((month) => (
                      <option key={month} value={month + 1}>
                        {month + 1}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-3 top-0.5 text-xs text-neutral-600 dark:text-neutral-500">
                    Month
                  </label>
                </div>

                {/* Day Selection */}
                <div className="relative w-1/4 mr-3">
                  <select
                    value={dobState.day}
                    onChange={(e) => handleDobChange("day", e.target.value)}
                    className="h-12 bg-transparent text-neutral-600 dark:text-neutral-300 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md w-full appearance-none"
                    required
                  >
                    <option value="">DD</option>
                    {[...Array(31).keys()].map((day) => (
                      <option key={day} value={day + 1}>
                        {day + 1}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-3 top-0.5 text-xs text-neutral-600 dark:text-neutral-500">
                    Day
                  </label>
                </div>

                {/* Year Selection */}
                <div className="relative w-1/2">
                  <select
                    value={dobState.year}
                    onChange={(e) => handleDobChange("year", e.target.value)}
                    className="h-12 bg-transparent text-neutral-600 dark:text-neutral-300 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md w-full appearance-none"
                    required
                  >
                    <option value="">YYYY</option>
                    {[...Array(2024 - 1960 + 1).keys()].map((year) => (
                      <option key={year} value={year + 1960}>
                        {year + 1960}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-3 top-0.5 text-xs text-neutral-600 dark:text-neutral-500">
                    Year
                  </label>
                </div>
              </div>
            </div>

            {/* Marketing Consent Toggle */}
            <div className="flex items-center w-full mt-3">
              <div
                onClick={toggleMarketingButton}
                className={`${
                  userMarketingConsent
                    ? "bg-blue-600"
                    : "bg-white border border-gray-400"
                } w-10 h-4 rounded-full p-1 flex items-center cursor-pointer mr-2 transition-colors duration-300`}
              >
                <div
                  className={`${
                    userMarketingConsent ? "bg-white" : "bg-gray-500"
                  } w-4 h-2.5 rounded-full transition-all duration-300 transform ${
                    userMarketingConsent ? "translate-x-4" : "translate-x-0"
                  }`}
                ></div>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-white text-xs">
                  I agree to receive new music or promo via email.
                </p>
              </div>
            </div>

            {/* Error Message or Additional Info */}
            <div className="flex flex-row w-full justify-center items-center mt-3 relative">
              {errorMessage ? (
                <p className="mt-0 text-xs text-red-500">
                  {errorMessage}
                </p>
              ) : (
                <p className="mt-0 text-xs text-neutral-200 dark:text-neutral-400">
                  This information will be used to generate your personal profile page
                  on our app and for analytics purposes.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 h-10 w-full bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-700"
            >
              {isLoading ? <LoadingIcon /> : "Complete Signup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
