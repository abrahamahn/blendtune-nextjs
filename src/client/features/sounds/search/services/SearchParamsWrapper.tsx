// src/client/features/sounds/search/services/SearchParamsWrapper.tsx

"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchParamsWrapperProps {
  /**
   * Callback function to handle the extracted token from the URL search parameters.
   * @param {string | null} token - The extracted token value or null if not found.
   */
  onParamsReady: (token: string | null) => void;
}

/**
 * SearchParamsWrapper Component
 *
 * A utility component that extracts the "token" parameter from the URL's query string
 * and passes it to the provided callback function.
 * 
 * @param {SearchParamsWrapperProps} props - Component properties.
 * @returns {null} This component does not render any UI.
 */
const SearchParamsWrapper: React.FC<SearchParamsWrapperProps> = ({ onParamsReady }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Invoke callback whenever the token parameter changes.
  useEffect(() => {
    onParamsReady(token);
  }, [token, onParamsReady]);

  return null; // This component does not render anything.
};

export default SearchParamsWrapper;
