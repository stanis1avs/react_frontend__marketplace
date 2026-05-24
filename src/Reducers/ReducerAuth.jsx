import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const ReducerAuth = createSlice({
  name: 'ReducerAuth',
  initialState,
  reducers: {
    authRequest(state) {
      return { ...state, loading: true, error: null };
    },
    authSuccess(state, action) {
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    },
    authFailure(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    authLogout() {
      return initialState;
    },
  },
});

export const { authRequest, authSuccess, authFailure, authLogout } = ReducerAuth.actions;
export default ReducerAuth.reducer;
