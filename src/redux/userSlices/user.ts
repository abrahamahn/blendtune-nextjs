import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
  marketing_consent: false,
  profile_created: false,
  preferred_language: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserFirstName: (state, action) => {
      state.first_name = action.payload;
    },
    setUserLastName: (state, action) => {
      state.last_name = action.payload;
    },
    setArtistCreatorName: (state, action) => {
      state.artist_creator_name = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phone_number = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    setDateOfBirth: (state, action) => {
      state.date_of_birth = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setUserType: (state, action) => {
      state.user_type = action.payload;
    },
    setOccupation: (state, action) => {
      state.occupation = action.payload;
    },
    setPreferredLanguage: (state, action) => {
      state.preferred_language = action.payload;
    },
    setMarketingConsent: (state, action) => {
      state.marketing_consent = action.payload;
    },
    setProfileCreated: (state, action) => {
      state.profile_created = action.payload;
    },
    setNoUser: (state) => {
      state.username = null;
      state.email = null;
      state.first_name = null;
      state.last_name = null;
      state.artist_creator_name = null;
      state.phone_number = null;
      state.gender = null;
      state.date_of_birth = null;
      state.city = null;
      state.state = null;
      state.country = null;
      state.user_type = null;
      state.occupation = null;
      state.preferred_language = null;
      state.marketing_consent = false;
      state.profile_created = false;
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
  setNoUser 
} = userSlice.actions;

export default userSlice.reducer;
