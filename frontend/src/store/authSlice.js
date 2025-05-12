/* eslint-disable no-unused-vars */
import { USER_API_END_POINT } from '@/utils/backendApiEndpoint';
import { createSlice } from '@reduxjs/toolkit';

const persistAuthState = (state) => {
  if (state.token && state.user) {
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: state.user,
        token: state.token,
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
    : { loading: false, user: null, token: null, error: null };
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
      state.token = action.payload.token;
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
      state.token = null;
      state.error = null;
      localStorage.removeItem('auth');
    },

    verifyToken: (state, action) => {
      if (action.payload?.valid) {
        state.user = action.payload.user;
        persistAuthState(state);
      } else {
        state.user = null;
        state.token = null;
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

export const verifyAuth = () => async (dispatch, getState) => {
  const { token } = getState().auth;

  if (!token) return;

  try {
    dispatch(requestStart());
    const response = await fetch(`${USER_API_END_POINT}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (data.success) {
      dispatch(verifyToken({ valid: true, user: data.user }));
    } else {
      dispatch(logout());
    }
  } catch (error) {
    dispatch(logout());
  }
};

export default authSlice.reducer;
