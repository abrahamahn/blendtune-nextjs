import { useState, useEffect } from "react";
import { fetchTracks } from "@/client/features/sounds/tracks/core/hooks";
import { extractUniqueKeywords } from "@/client/features/sounds/metadata/utils";

/**
 * Custom hook to fetch and extract unique keywords from track data.
 * 
 * This hook retrieves the list of tracks, processes the keywords,
 * and stores them in state for use in the application.
 */
const useKeywords = () => {
  const [keywords, setKeywords] = useState<string[] | undefined>(); // State to store extracted keywords

  useEffect(() => {
    /**
     * Fetches track data and extracts unique keywords.
     * Updates the local state with the retrieved keyword list.
     */
    const fetchAndSetKeywords = async () => {
      try {
        const tracks = await fetchTracks(); // Fetch track data from API
        const uniqueKeywordsArray = extractUniqueKeywords(tracks); // Updated function name
        setKeywords(uniqueKeywordsArray); // Update state with keywords
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchAndSetKeywords();
  }, []); // Runs only once when the component using this hook mounts

  return { keywords }; // Return the keywords state
};

export default useKeywords;