import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { Player } from '@/api/types';

export interface AuthApiState {
  basicPlayerInfo?: Player | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthApiState = {
  basicPlayerInfo: null,
  status: 'idle',
  error: null,
  isAuthenticated: false
};

// signup with Google
export const googleSignup = createAsyncThunk(
  'auth/googleSignup',
  async (accessToken: string) => {
    const response = await api.post('/auth/googleSignup', {
      accessToken
    });
    // check domain for dartmouth.edu
    const data = response.data;
    const email = data.email;
    const domain = email?.split('@')[1];
    if (domain !== 'dartmouth.edu') {
      throw new Error('Unauthorized domain, sign in with a Dartmouth account.');
    }

    return response.data;
  }
);

//logout
export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await api.post('/auth/logout', {});
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(googleSignup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        googleSignup.fulfilled,
        (state, action: PayloadAction<Player>) => {
          state.basicPlayerInfo = action.payload;
          state.status = 'idle';
          state.error = null;
          state.isAuthenticated = true;
        }
      )
      .addCase(googleSignup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = 'idle';
        state.basicPlayerInfo = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Logout failed';
      });
  }
});

export default authSlice.reducer;
