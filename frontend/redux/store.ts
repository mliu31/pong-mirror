// if new to Redux/React-Redux, see Redux Fundamentals:
// https://redux.js.org/tutorials/fundamentals/part-1-overview

import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import authReducer from './slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer) // handles authenticating (signing/logging in) a player
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store); // creates a persistor for the store

// gets state
// ie. to access the state manage by authReducer call state.auth.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // gets dispatch type

export default store;
