import { authRequest, authSuccess, authFailure, authLogout } from '../Reducers/ReducerAuth';
import { syncCart } from '../Reducers/ReducerCart';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export const beginRegistration = (username) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const res = await fetch(`${API}/api/auth/register/begin/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return await res.json();
  } catch (err) {
    dispatch(authFailure(err.message));
    throw err;
  }
};

export const completeRegistration = (username, credential) => async (dispatch, getState) => {
  try {
    const cartItems = getState().ReducerCart?.items || [];
    const res = await fetch(`${API}/api/auth/register/complete/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, credential, cart: cartItems }),
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    const data = await res.json();
    dispatch(authSuccess({ user: { username: data.username }, token: data.token }));
    if (data.cart) dispatch(syncCart(data.cart));
    return data;
  } catch (err) {
    dispatch(authFailure(err.message));
    throw err;
  }
};

export const beginLogin = (username) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const res = await fetch(`${API}/api/auth/login/begin/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return await res.json();
  } catch (err) {
    dispatch(authFailure(err.message));
    throw err;
  }
};

export const completeLogin = (username, credential) => async (dispatch, getState) => {
  try {
    const cartItems = getState().ReducerCart?.items || [];
    const res = await fetch(`${API}/api/auth/login/complete/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, credential, cart: cartItems }),
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    const data = await res.json();
    dispatch(authSuccess({ user: { username: data.username }, token: data.token }));
    if (data.cart) dispatch(syncCart(data.cart));
    return data;
  } catch (err) {
    dispatch(authFailure(err.message));
    throw err;
  }
};

export const logoutUser = () => async (dispatch, getState) => {
  const token = getState().ReducerAuth?.token;
  if (token) {
    await fetch(`${API}/api/auth/logout/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  dispatch(authLogout());
};
