import { useState, useEffect } from "react";
import { getTracks } from "@/client/utils/data/getTracks";
import { uniqueKeywords } from "@/client/utils/data/uniqueKeywords";

const useKeywords = () => {
  const [keywords, setKeywords] = useState<string[]>();

  useEffect(() => {
    const fetchAndSetKeywords = async () => {
      try {
        const tracks = await getTracks();
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
