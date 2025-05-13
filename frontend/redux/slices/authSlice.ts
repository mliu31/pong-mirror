import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { Player } from '@/api/types';
import { AxiosError } from 'axios';

type NewPlayer = Pick<Player, 'name' | 'email'>;
type LoginPlayer = Pick<Player, 'email'>;

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

// signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: NewPlayer, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data.player;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      if (err.response && err.response.data && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      }

      return rejectWithValue('Sign up failed. Please try again.');
    }
  }
);

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
      throw new Error('Unauthorized domain');
    }

    return response.data;
  }
);

// login
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginPlayer, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data.player;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      if (err.response && err.response.data && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      }

      return rejectWithValue('Login failed. Please try again.');
    }
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
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<Player>) => {
        console.log('Signup fulfilled payload:', action.payload); // testing
        state.basicPlayerInfo = action.payload;
        state.status = 'idle';
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<Player>) => {
        console.log('Login fulfilled payload:', action.payload); // testing
        state.basicPlayerInfo = action.payload;
        state.status = 'idle';
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
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
