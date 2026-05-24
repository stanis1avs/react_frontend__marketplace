import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  loading: false,
  status: null,
  synced: false,  // true when items are in sync with DB
};

export const ReducerCart = createSlice({
  name: 'ReducerCart',
  initialState,
  reducers: {
    cartAdd(state, action) {
      const items = [...state.items, action.payload];
      const total = items.reduce((sum, item) => sum + item.result, 0);
      return { ...state, items, total, synced: false };
    },
    cartReset() {
      return initialState;
    },
    cartDelete(state, action) {
      const items = [...state.items];
      items.splice(action.payload, 1);
      const total = items.reduce((sum, item) => sum + item.result, 0);
      return { ...state, status: null, total, items, synced: false };
    },
    // Replace local cart with DB cart after login/registration
    syncCart(state, action) {
      const dbItems = action.payload.map((dbItem) => ({
        dbItemId: dbItem.id,       // DB CartItem.id for PATCH/DELETE
        id: dbItem.product_id,
        title: dbItem.title,
        size: dbItem.size,
        count: dbItem.count,
        price: dbItem.price,
        result: dbItem.count * dbItem.price,
      }));
      const total = dbItems.reduce((sum, item) => sum + item.result, 0);
      return { ...state, items: dbItems, total, synced: true };
    },
    sendItemsRequest(state) {
      return { ...state, status: 'Оформляем покупку, пожалуйста подождите', loading: true };
    },
    sendItemsSuccess(state) {
      return { ...state, status: 'Заказ успешно оформлен, спасибо за покупку!', loading: false };
    },
    sendItemsFailure(state) {
      return { ...state, status: 'Что-то пошло не так, пожалуйста попробуйте позже!', loading: false };
    },
  },
});

export const {
  cartAdd, cartDelete, cartReset, syncCart,
  sendItemsRequest, sendItemsSuccess, sendItemsFailure,
} = ReducerCart.actions;
export default ReducerCart.reducer;
