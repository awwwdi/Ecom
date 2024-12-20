import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { 
  login, 
  logout, 
  setUser, 
  setError, 
  clearError,
  setLoading 
} = authSlice.actions;

export default authSlice.reducer; 