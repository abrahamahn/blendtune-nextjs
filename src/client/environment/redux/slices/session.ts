import { createSlice } from '@reduxjs/toolkit';

export interface SessionState {
  status: boolean;
  authenticated: boolean;
}

const initialState: SessionState = {
  authenticated: false,
  status: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setAuthenticated: state => {
      state.authenticated = true;
    },
    setUnauthenticated: state => {
      state.authenticated = false;
    },
    setOnline: (state, action) => {
      state.status = action.payload;
    },
    setOffline: (state) => {
      state.authenticated = false;
      state.status = false;
    },
  },
});

export const { setAuthenticated, setUnauthenticated, setOnline, setOffline } = sessionSlice.actions;

export default sessionSlice.reducer;
