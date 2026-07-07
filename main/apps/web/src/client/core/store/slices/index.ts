// src/client/core/store/slices/index.ts

// Authentication session slice
export {
  setAuthenticated,
  setUnauthenticated,
} from "@features/auth/store/sessionSlice";

// User profile slice
export {
  setArtistCreatorName,
  setGender,
  setDateOfBirth,
  setUserType,
  setOccupation,
  setMarketingConsent,
} from "../../../features/auth/store/userSlice";

// Filter management slice
export {
  // Category & Genre
  selectGenres,
  setGenres,
  removeAllGenres,
  // Tempo
  setMinTempo,
  setMaxTempo,
  setIncludeHalfTime,
  setIncludeDoubleTime,
  // Key
  setSelectedKeys,
  setSelectedScale,
  setKeyFilterCombinations,
  // Artist, Instrument, Mood
  setSelectedArtists,
  setSelectedInstruments,
  setSelectedMoods,
  // Keywords
  selectKeyword,
  selectKeywords,
  deselectKeyword,
  removeAllKeywords,
  // Clear All
  clearAllFilters,
} from "@client/features/sounds/filters/store/filterSlice";

// Exporting types for type safety
export type {
  KeyFilterCombination,
} from "@client/features/sounds/filters/store/filterSlice";
