import { recRequest, recSuccess, recFailure } from '../Reducers/ReducerRecommendations';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export const fetchRecommendations = (params = {}) => async (dispatch, getState) => {
  dispatch(recRequest());
  try {
    const state = getState();
    const token = state.ReducerAuth?.token;
    const cartItems = state.ReducerCart?.items || [];

    const url = new URL(`${API}/api/recommendations/`);

    if (params.productId) {
      url.searchParams.set('product_id', params.productId);
    }

    // Send cart_ids only for anonymous users; logged-in users get cart from DB
    if (!token && cartItems.length > 0) {
      const cartIds = [...new Set(cartItems.map((i) => i.id))].join(',');
      url.searchParams.set('cart_ids', cartIds);
    }

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    dispatch(recSuccess(data));
  } catch (err) {
    dispatch(recFailure(err.message));
  }
};
