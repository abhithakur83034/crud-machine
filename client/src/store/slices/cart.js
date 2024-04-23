import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cartItems: [],
  totalAmount: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialLoginData: (state, action) => {
      state.cartItems = action.payload;
    },
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.product_id === action.payload.product_id &&
          item.user_id === action.payload.user_id
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].item_qty += 1;
      } else {
        const createCartData = { ...action.payload, item_qty: 1 };
        state.cartItems.push(createCartData);
      }
    },
    decreaseQty: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.product_id === action.payload.product_id &&
          item.user_id === action.payload.user_id
      );
      if (itemIndex >= 0) {
        if (state.cartItems[itemIndex].item_qty > 1) {
          state.cartItems[itemIndex].item_qty -= 1;
        } else {
          state.cartItems.splice(itemIndex, 1);
          state.totalAmount = 0;
        }
      }
    },
    getTotalAmount: (state, action) => {
      if (action.payload) {
        const amount = state.cartItems.map((total, item) => {
          return (
            action?.payload === total?.user_id &&
            total?.discount_price * total?.item_qty
          );
        });
        if (amount.length > 0) {
          const total = amount.reduce((data, item) => {
            return data + item;
          });
          state.totalAmount = total;
        }
      }
    },
    removeCartItem: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item.product_id === action.payload.product_id &&
          item.user_id === action.payload.user_id
      );
      if (itemIndex >= 0) {
        state.cartItems.splice(itemIndex, 1);
        if (state.cartItems.length === 0) {
          state.totalAmount = 0;
        }
      }
    },
    clearCart: (state, action) => {
      const filterData = state.cartItems.filter((item, index) => {
        return item.user_id !== action.payload;
      });
      state.cartItems = filterData;
      state.totalAmount = 0;
    },
  },
});

export default cartSlice.reducer;
export const {
  addToCart,
  decreaseQty,
  getTotalAmount,
  removeCartItem,
  clearCart,
  initialLoginData,
} = cartSlice.actions;
export const getCartItems = (state) => state.cart;
