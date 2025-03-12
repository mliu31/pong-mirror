// if new to Redux/React-Redux, see Redux Fundamentals:
// https://redux.js.org/tutorials/fundamentals/part-1-overview

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer // handles authenticating (signing/logging in) a player
  }
});

// gets state
// ie. to access the state manage by authReducer call state.auth.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // gets dispatch type

export default store;
