import { sendItemsRequest, sendItemsSuccess, sendItemsFailure, syncCart } from '../Reducers/ReducerCart';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const postItem = (order) => async (dispatch, getState) => {
  const { phone, address, items } = order;
  const token = getState().ReducerAuth?.token;
  dispatch(sendItemsRequest());
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SEND_ORDER}`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ owner: { phone, address }, items }),
    });
    if (!res.ok) throw new Error(res.statusText);
    dispatch(sendItemsSuccess());
  } catch {
    dispatch(sendItemsFailure());
  }
};

// Add item to DB cart (when logged in) and keep Redux in sync
export const addToDbCart = ({ productId, size, count }) => async (dispatch, getState) => {
  const token = getState().ReducerAuth?.token;
  if (!token) return;
  try {
    const res = await fetch(`${API}/api/cart/`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ product_id: productId, size, count }),
    });
    if (!res.ok) return;
    const dbItems = await res.json();
    dispatch(syncCart(dbItems));
  } catch {
    // silent — local cart is still valid
  }
};

export const updateDbCartItem = ({ itemId, count }) => async (dispatch, getState) => {
  const token = getState().ReducerAuth?.token;
  if (!token) return;
  try {
    const res = await fetch(`${API}/api/cart/${itemId}/`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ count }),
    });
    if (!res.ok) return;
    const dbItems = await res.json();
    dispatch(syncCart(dbItems));
  } catch {
    // silent
  }
};

export const deleteFromDbCart = (itemId) => async (dispatch, getState) => {
  const token = getState().ReducerAuth?.token;
  if (!token) return;
  try {
    const res = await fetch(`${API}/api/cart/${itemId}/`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) return;
    const dbItems = await res.json();
    dispatch(syncCart(dbItems));
  } catch {
    // silent
  }
};
