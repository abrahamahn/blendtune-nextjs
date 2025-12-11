import { configureStore, combineReducers } from "@reduxjs/toolkit";
import sessionReducer from "../../features/auth/store/sessionSlice";
import userReducer from "../../features/auth/store/userSlice";
import filterReducer from "../../features/sounds/filters/store/filterSlice";

// Group authentication-related reducers
const authReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
});

// Group track & filter selection reducers
const tracksReducer = combineReducers({
  filters: filterReducer,
});

// Combine all domain reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  tracks: tracksReducer,
});

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
});

// TypeScript type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
