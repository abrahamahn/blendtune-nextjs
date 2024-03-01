import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  first_name: null,
  last_name: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserFirstName: (state, action) => {
      state.first_name = action.payload;
    },
    setUserLastName: (state, action) => {
      state.last_name = action.payload;
    },
    setNoUser: (state) => {
      state.email = null;
      state.first_name = null;
      state.last_name = null;
    }
  },
});

export const { setUserEmail, setUserFirstName, setUserLastName, setNoUser } = userSlice.actions;

export default userSlice.reducer;
