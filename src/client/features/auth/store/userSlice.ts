// src\client\features\auth\store\userSlice.ts

/**
 * @fileoverview Redux slice for managing user profile data
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * User state interface defining all user profile fields
 */
export interface UserState {
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  artist_creator_name: string | null;
  phone_number: string | null;
  gender: string | null;
  date_of_birth: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  user_type: string | null;
  occupation: string | null;
  preferred_language: string | null;
  marketing_consent: boolean;
  profile_created: boolean;
}

/**
 * Initial user state with null values
 */
const initialState: UserState = {
  username: null,
  email: null,
  first_name: null,
  last_name: null,
  artist_creator_name: null,
  phone_number: null,
  gender: null,
  date_of_birth: null,
  city: null,
  state: null,
  country: null,
  user_type: null,
  occupation: null,
  preferred_language: null,
  marketing_consent: false,
  profile_created: false,
};

/**
 * User slice containing reducers for profile management
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Additional profile reducers
    setArtistCreatorName: (state, action: PayloadAction<string | null>) => {
      state.artist_creator_name = action.payload;
    },
    setGender: (state, action: PayloadAction<string | null>) => {
      state.gender = action.payload;
    },
    setDateOfBirth: (state, action: PayloadAction<string | null>) => {
      state.date_of_birth = action.payload;
    },

    // Preferences reducers
    setUserType: (state, action: PayloadAction<string | null>) => {
      state.user_type = action.payload;
    },
    setOccupation: (state, action: PayloadAction<string | null>) => {
      state.occupation = action.payload;
    },
    setMarketingConsent: (state, action: PayloadAction<boolean>) => {
      state.marketing_consent = action.payload;
    },

    // Bulk update reducers
    setUserProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUserProfile: () => {
      return { ...initialState };
    },
    // Legacy support
    setNoUser: () => {
      return { ...initialState };
    },
  },
});

export const {
  setArtistCreatorName,
  setGender,
  setDateOfBirth,
  setUserType,
  setOccupation,
  setMarketingConsent,
  setUserProfile,
  clearUserProfile,
  setNoUser,
} = userSlice.actions;

export default userSlice.reducer;
