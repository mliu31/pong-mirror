import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import { Player } from '@/api/types';

type NewPlayer = Player;

interface AuthApiState {
  basicPlayerInfo?: Player | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthApiState = {
  basicPlayerInfo: null,
  status: 'idle',
  error: null
};

const loadPlayer = async (): Promise<Player | null> => {
  const storedData = await AsyncStorage.getItem('player');
  return storedData ? JSON.parse(storedData) : null;
};

export const loadAuthState = createAsyncThunk(
  'auth/loadAuthState',
  async () => {
    return await loadPlayer();
  }
);

// signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: NewPlayer) => {
    const response = await api.post('/auth/signup', data);
    const resData = response.data;
    await AsyncStorage.setItem('player', JSON.stringify(resData));
    return resData;
  }
);

// login
export const login = createAsyncThunk('auth/login', async (data: NewPlayer) => {
  const response = await api.post('/auth/login', data);
  const resData = response.data;
  await AsyncStorage.setItem('player', JSON.stringify(resData));
  return resData;
});

//logout
export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await api.post('/auth/logout', {});
  const resData = response.data;
  localStorage.removeItem('player');
  return resData;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<NewPlayer>) => {
        state.basicPlayerInfo = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<NewPlayer>) => {
        state.basicPlayerInfo = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = 'idle';
        state.basicPlayerInfo = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Logout failed';
      });
  }
});

export default authSlice.reducer;
