import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionReducer from './slices/session';
import userReducer from './slices/user';
import selectedReducer from './slices/keyword';
import audioPlayBackReducer from './slices/playback';


const rootReducer = combineReducers({
  auth: combineReducers({
    session: sessionReducer,
    user: userReducer,
  }),
  tracks: combineReducers({
    selected: selectedReducer,
  }),
  audio: combineReducers({
    playback: audioPlayBackReducer,
  }),
});

export const RootStore = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof RootStore.getState>;
export type AppDispatch = typeof RootStore.dispatch;
