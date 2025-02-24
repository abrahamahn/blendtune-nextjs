// src/client/features/sounds/filters/utils/filters.ts
import { Track } from '@/shared/types/track';

/**
 * Filters tracks based on tempo and time modification options
 * 
 * @param {Track} track - The track to be filtered
 * @param {number} minTempo - Minimum tempo threshold
 * @param {number} maxTempo - Maximum tempo threshold
 * @param {boolean} includeHalfTime - Whether to include half-time tracks
 * @param {boolean} includeDoubleTime - Whether to include double-time tracks
 * @returns {boolean} - Whether the track passes the tempo filter
 */
export const tempoFilter = (track: Track, minTempo: number, maxTempo: number, includeHalfTime: boolean, includeDoubleTime: boolean) => {
  // If BPM is not a valid number, return false
  // Otherwise, check if the track's tempo meets the filter criteria
  return (!isNaN(parseFloat(track.info.bpm)) &&
          ((parseFloat(track.info.bpm) >= minTempo &&
            parseFloat(track.info.bpm) <= maxTempo) ||
            (includeHalfTime &&
              parseFloat(track.info.bpm) >= minTempo / 2 &&
              parseFloat(track.info.bpm) <= maxTempo / 2) ||
            (includeDoubleTime &&
              parseFloat(track.info.bpm) >= minTempo * 2 &&
              parseFloat(track.info.bpm) <= maxTempo * 2))) ||
        (minTempo === 40 && maxTempo === 200);
}

/**
 * Filters tracks based on musical key and scale
 * 
 * @param {Track} track - The track to be filtered
 * @param {Array} keyFilterCombinations - Array of key filter combinations
 * @returns {boolean} - Whether the track passes the key filter
 */
export const keyFilter = (track: Track, keyFilterCombinations: Array<{
  key: string | null;
  'key.note': string | null;
  'key.scale': string | null;
}>) => {
  // If no filter combinations, return true
  // Otherwise, check if any combination matches the track's key
  return keyFilterCombinations.length === 0 ||
        keyFilterCombinations.some(combination => {
          const { 'key.note': note, 'key.scale': scale } = combination || {};
          const passes =
            track.info.key.note === note && 
            track.info.key.scale.toLowerCase() === scale?.toLowerCase();  // Case-insensitive comparison
          return passes;
        });
};

/**
 * Filters tracks based on category
 * 
 * @param {Track} track - The track to be filtered
 * @param {string} selectedCategory - Selected category to filter by
 * @returns {boolean} - Whether the track passes the category filter
 */
export const categoryFilter = (track: Track, selectedCategory: string) => {
  // If category is 'All', return true
  // Otherwise, check if track matches the selected category
  if (selectedCategory === 'All') {
    return true;
  } else {
    return track.info.genre.some(g => 
      g.maingenre === selectedCategory || 
      (g.subgenre && g.subgenre.includes(selectedCategory))
    );
  }
};

/**
 * Filters tracks based on genre
 * 
 * @param {Track} track - The track to be filtered
 * @param {string[]} selectedGenres - Array of selected genres
 * @returns {boolean} - Whether the track passes the genre filter
 */
export const genreFilter = (track: Track, selectedGenres: string[]) => {
  // If no genres selected, return true
  // Otherwise, check if track matches any of the selected genres
  const selectedGenresEmpty = selectedGenres.length === 0;
  return selectedGenresEmpty || selectedGenres.some(genre => {
    return track.info.genre.some(
      g => g.maingenre === genre || (g.subgenre && g.subgenre.includes(genre))
    );
  });
};

/**
 * Filters tracks based on artist
 * 
 * @param {Track} track - The track to be filtered
 * @param {string[]} selectedArtists - Array of selected artists
 * @returns {boolean} - Whether the track passes the artist filter
 */
export const artistFilter = (track: Track, selectedArtists: string[]) => {
  // If no artists selected, return true
  // Otherwise, check if track matches any of the selected artists
  const selectedArtistsEmpty = selectedArtists.length === 0;
  return selectedArtistsEmpty || selectedArtists.some(artist => {
    return track.info.relatedartist.includes(artist);
  });
};

/**
 * Filters tracks based on instruments
 * 
 * @param {Track} track - The track to be filtered
 * @param {string[]} selectedInstruments - Array of selected instruments
 * @returns {boolean} - Whether the track passes the instrument filter
 */
export const instrumentFilter = (track: Track, selectedInstruments: string[]) => {
  // If no instruments selected, return true
  // Otherwise, check if track matches any of the selected instruments
  const selectedInstrumentsEmpty = selectedInstruments.length === 0;
  return selectedInstrumentsEmpty || selectedInstruments.some(instrument => {
    return track.instruments.some(instr => instr.main === instrument);
  });
};

/**
 * Filters tracks based on mood
 * 
 * @param {Track} track - The track to be filtered
 * @param {string[]} selectedMoods - Array of selected moods
 * @returns {boolean} - Whether the track passes the mood filter
 */
export const moodFilter = (track: Track, selectedMoods: string[]) => {
  // If no moods selected, return true
  // Otherwise, check if track matches any of the selected moods
  const selectedMoodsEmpty = selectedMoods.length === 0;
  return selectedMoodsEmpty || selectedMoods.some(mood => {
    return track.info.mood.includes(mood);
  });
};

/**
 * Filters tracks based on keywords across multiple track properties
 * 
 * @param {Track} track - The track to be filtered
 * @param {string[] | null} selectedKeywords - Array of keywords to filter by
 * @returns {boolean} - Whether the track passes the keyword filter
 */
export const keywordFilter = (track: Track, selectedKeywords: string[] | null) => {
  // If no keywords selected, return true
  // Otherwise, check if track matches any of the selected keywords
  if (!selectedKeywords || selectedKeywords.length === 0) {
    return true;
  }

  return selectedKeywords.some(keyword => {
    // Perform null-safe checks across multiple track properties
    return (
      (track.metadata?.title?.includes(keyword) ?? false) ||
      (track.metadata?.producer?.includes(keyword) ?? false) ||
      (track.info?.genre?.some(g => 
        g.maingenre?.includes(keyword) || 
        (g.subgenre && g.subgenre.includes(keyword))
      ) ?? false) ||
      (track.info?.relatedartist?.some(artist => 
        artist?.includes(keyword)
      ) ?? false) ||
      (track.instruments?.some(instr => 
        instr.main?.includes(keyword) || 
        (instr.sub && instr.sub.includes(keyword))
      ) ?? false) ||
      (track.info?.mood?.some(mood => 
        mood?.includes(keyword)
      ) ?? false)
    );
  });
};