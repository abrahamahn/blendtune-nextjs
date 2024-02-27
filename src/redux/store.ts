import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionReducer from './userSlices/session';
import userReducer from './userSlices/user';
import selectedReducer from './trackSlices/keyword';
import audioPlayBackReducer from './audioSlices/playback';


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
