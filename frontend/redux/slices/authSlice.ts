import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';

interface Player {
  name: string;
  email: string;
}

type NewPlayer = Player;

interface PlayerInfo {
  id: string;
  name: string;
  email: string;
}

interface AuthApiState {
  basicPlayerInfo?: PlayerInfo | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthApiState = {
  basicPlayerInfo: null,
  status: 'idle',
  error: null
};

const loadPlayerInfo = async (): Promise<PlayerInfo | null> => {
  const storedData = await AsyncStorage.getItem('playerInfo');
  return storedData ? JSON.parse(storedData) : null;
};

export const loadAuthState = createAsyncThunk(
  'auth/loadAuthState',
  async () => {
    return await loadPlayerInfo();
  }
);

// signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: NewPlayer) => {
    const response = await api.post('/signup', data);
    const resData = response.data;

    await AsyncStorage.setItem('playerInfo', JSON.stringify(resData));
    return resData;
  }
);

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
      .addCase(signup.fulfilled, (state, action: PayloadAction<PlayerInfo>) => {
        state.basicPlayerInfo = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default authSlice.reducer;
