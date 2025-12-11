/**
* @fileoverview Redux slice for managing user profile data
*/

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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
 name: 'user',
 initialState,
 reducers: {
   // Basic info reducers
   setUsername: (state, action: PayloadAction<string | null>) => {
     state.username = action.payload;
   },
   setUserEmail: (state, action: PayloadAction<string | null>) => {
     state.email = action.payload;
   },
   setUserFirstName: (state, action: PayloadAction<string | null>) => {
     state.first_name = action.payload;
   },
   setUserLastName: (state, action: PayloadAction<string | null>) => {
     state.last_name = action.payload;
   },

   // Additional profile reducers
   setArtistCreatorName: (state, action: PayloadAction<string | null>) => {
     state.artist_creator_name = action.payload;
   },
   setPhoneNumber: (state, action: PayloadAction<string | null>) => {
     state.phone_number = action.payload;
   },
   setGender: (state, action: PayloadAction<string | null>) => {
     state.gender = action.payload;
   },
   setDateOfBirth: (state, action: PayloadAction<string | null>) => {
     state.date_of_birth = action.payload;
   },

   // Location reducers
   setCity: (state, action: PayloadAction<string | null>) => {
     state.city = action.payload;
   },
   setState: (state, action: PayloadAction<string | null>) => {
     state.state = action.payload;
   },
   setCountry: (state, action: PayloadAction<string | null>) => {
     state.country = action.payload;
   },

   // Preferences reducers
   setUserType: (state, action: PayloadAction<string | null>) => {
     state.user_type = action.payload;
   },
   setOccupation: (state, action: PayloadAction<string | null>) => {
     state.occupation = action.payload;
   },
   setPreferredLanguage: (state, action: PayloadAction<string | null>) => {
     state.preferred_language = action.payload;
   },
   setMarketingConsent: (state, action: PayloadAction<boolean>) => {
     state.marketing_consent = action.payload;
   },
   setProfileCreated: (state, action: PayloadAction<boolean>) => {
     state.profile_created = action.payload;
   },

   // Bulk update reducers
   setUserProfile: (_state, action: PayloadAction<Partial<UserState>>) => {
     return { ..._state, ...action.payload };
   },
   clearUserProfile: () => {
     return { ...initialState };
   },
   // Legacy support
   setNoUser: () => {
     return { ...initialState };
   }
 },
});

export const {
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
} = userSlice.actions;

export default userSlice.reducer;
