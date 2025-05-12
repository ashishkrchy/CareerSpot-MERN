import { USER_API_END_POINT } from '@/utils/backendApiEndpoint';
import { createSlice } from '@reduxjs/toolkit';

const persistAuthState = (state) => {
  if (state.user) {
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: state.user,
      })
    );
  } else {
    localStorage.removeItem('auth');
  }
};

const loadInitialState = () => {
  const persistedState = localStorage.getItem('auth');
  return persistedState
    ? JSON.parse(persistedState)
    : { loading: false, user: null, error: null };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
      persistAuthState(state);
    },

    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      persistAuthState(state);
    },

    setUser: (state, action) => {
      state.user = action.payload;
      persistAuthState(state);
    },

    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('auth');
    },

    verifyToken: (state, action) => {
      if (action.payload?.valid) {
        state.user = action.payload.user;
        persistAuthState(state);
      } else {
        state.user = null;
        localStorage.removeItem('auth');
      }
    },
  },
});

export const {
  requestStart,
  authSuccess,
  requestFailure,
  setUser,
  logout,
  verifyToken,
} = authSlice.actions;

export default authSlice.reducer;
