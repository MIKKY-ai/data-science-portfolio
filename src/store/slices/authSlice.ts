// Auth Slice - Manages user authentication state
// Handles login, registration, and session persistence via AsyncStorage

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';
import { fakeStoreApi } from '../../services/api/fakeStoreApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunk to login user via Fake Store API and persist token
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fakeStoreApi.post('/auth/login', {
        username: email,
        password: password,
      });
      const token = response.data.token;
      const user: User = { id: '1', name: email.split('@')[0], email };

      // Persist authentication data to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      return { token, user };
    } catch (error: any) {
      // For demo purposes, allow login with any credentials
      const token = 'demo-token-' + Date.now();
      const user: User = { id: '1', name: email.split('@')[0], email };
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      return { token, user };
    }
  }
);

// Async thunk to register a new user (POST request - demonstrates REST write operation)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // POST to Fake Store API /users - demonstrates REST write operation
      const response = await fakeStoreApi.post('/users', {
        email,
        username: email,
        password,
        name: { firstname: name.split(' ')[0], lastname: name.split(' ')[1] || '' },
        address: {
          city: 'Birmingham',
          street: '123 Main St',
          number: 1,
          zipcode: 'B1 1AA',
          geolocation: { lat: '52.4862', long: '-1.8904' },
        },
        phone: '0000000000',
      });

      const token = 'token-' + (response.data.id || Date.now());
      const user: User = { id: String(response.data.id || '1'), name, email };

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Async thunk to restore session from AsyncStorage on app launch
export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (token && userData) {
    return { token, user: JSON.parse(userData) as User };
  }
  return null;
});

// Async thunk to logout and clear persisted data
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Login failed';
    });
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Registration failed';
    });
    // Restore session
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
    });
    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
