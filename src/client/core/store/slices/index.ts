// src/client/core/store/slices/index.ts

// Authentication session slice
export {
  setAuthenticated,
  setUnauthenticated,
  setOnline,
  setOffline,
  default as sessionReducer,
} from "@auth/store/sessionSlice";

// User profile slice
export {
  setUsername,
  setUserEmail,
  setUserFirstName,
  setUserLastName,
  setArtistCreatorName,
  setPhoneNumber,
  setGender,
  setDateOfBirth,
  setCity,
  setState,
  setCountry,
  setUserType,
  setOccupation,
  setPreferredLanguage,
  setMarketingConsent,
  setProfileCreated,
  setUserProfile,
  clearUserProfile,
  setNoUser,
  default as userReducer,
} from "../../../features/auth/store/userSlice";

// Track selection & keyword management slice
export {
  selectGenres,
  selectCategory,
  removeAllGenres,
  selectKeyword,
  selectKeywords,
  deselectKeyword,
  removeAllKeywords,
  default as keywordReducer,
} from "@tracks/store/keywordSlice";

// Audio playback slice
export {
  setCurrentTrack,
  setIsPlaying,
  setTrackList,
  setLoopedTrackList,
  setLoopMode,
  setIsVolumeVisible,
  setCurrentTime,
  setTrackDuration,
  default as playbackReducer,
} from "@player/store/playbackSlice";

// Exporting types for type safety
export type { SessionState } from "@auth/store/sessionSlice";
export type { UserState } from "@auth/store/userSlice";
export type { KeywordState } from "@tracks/store/keywordSlice";
