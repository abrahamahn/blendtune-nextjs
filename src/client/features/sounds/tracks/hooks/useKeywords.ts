// src\client\features\sounds\tracks\hooks\useKeywords.ts
import { useState, useEffect } from "react";
import { fetchTracks } from "@tracks/hooks";
import { uniqueKeywords } from "@tracks/utils/uniqueKeywords";

const useKeywords = () => {
  const [keywords, setKeywords] = useState<string[]>();

  useEffect(() => {
    const fetchAndSetKeywords = async () => {
      try {
        const tracks = await fetchTracks();
        const uniqueKeywordsArray = uniqueKeywords(tracks);
        setKeywords(uniqueKeywordsArray);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchAndSetKeywords();
  }, []);

  return { keywords };
};

export default useKeywords;
