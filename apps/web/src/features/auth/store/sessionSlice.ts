/**
* @fileoverview Redux slice for managing user session state
*/

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
* Session state interface
*/
export interface SessionState {
 status: boolean;
 authenticated: boolean;
 loading: boolean;
}

/**
* Initial session state
*/
const initialState: SessionState = {
 authenticated: false,
 status: false,
 loading: true,
};

/**
* Session slice with authentication reducers
*/
const sessionSlice = createSlice({
 name: 'session',
 initialState,
 reducers: {
   setAuthenticated: (state) => {
     state.authenticated = true;
     state.loading = false;
   },
   setUnauthenticated: (state) => {
     state.authenticated = false;
     state.loading = false;
   },
   setOnline: (state, action: PayloadAction<boolean>) => {
     state.status = action.payload;
   },
   setOffline: (state) => {
     state.authenticated = false;
     state.status = false;
   },
   setLoading: (state, action: PayloadAction<boolean>) => {
     state.loading = action.payload;
   },
 },
});

export const {
 setAuthenticated,
 setUnauthenticated,
 setOnline,
 setOffline,
 setLoading
} = sessionSlice.actions;

export default sessionSlice.reducer;
