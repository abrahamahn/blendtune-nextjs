// src\client\features\auth\store\sessionSlice.ts

/**
* @fileoverview Redux slice for managing user session state
*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
* Session state interface
*/
export interface SessionState {
 status: boolean;
 authenticated: boolean;
}

/**
* Initial session state
*/
const initialState: SessionState = {
 authenticated: false,
 status: false,
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
   },
   setUnauthenticated: (state) => {
     state.authenticated = false;
   },
   setOnline: (state, action: PayloadAction<boolean>) => {
     state.status = action.payload;
   },
   setOffline: (state) => {
     state.authenticated = false;
     state.status = false;
   },
 },
});

export const { 
 setAuthenticated, 
 setUnauthenticated, 
 setOnline, 
 setOffline 
} = sessionSlice.actions;

export default sessionSlice.reducer;