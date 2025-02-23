// src/client/core/store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import sessionReducer from "../../features/auth/store/sessionSlice";
import userReducer from "../../features/auth/store/userSlice";
import keywordReducer from "@tracks/store/keywordSlice";
import playbackReducer from "@player/store/playbackSlice";

// Group authentication-related reducers
const authReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
});

// Group track & keyword selection reducers
const tracksReducer = combineReducers({
  selected: keywordReducer,
});

// Group audio playback-related reducers
const audioReducer = combineReducers({
  playback: playbackReducer,
});

// Combine all domain reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  tracks: tracksReducer,
  audio: audioReducer,
});

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  // Middleware configuration can be added here (e.g., thunk, logger)
});

// TypeScript type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
