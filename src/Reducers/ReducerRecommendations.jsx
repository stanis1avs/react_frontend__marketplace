import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const ReducerRecommendations = createSlice({
  name: 'ReducerRecommendations',
  initialState,
  reducers: {
    recRequest(state) {
      return { ...state, loading: true, error: null };
    },
    recSuccess(state, action) {
      return { ...state, items: action.payload, loading: false, error: null };
    },
    recFailure(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
  },
});

export const { recRequest, recSuccess, recFailure } = ReducerRecommendations.actions;
export default ReducerRecommendations.reducer;
