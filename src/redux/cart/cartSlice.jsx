import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        // ✅ protect stock
        if (existingItem.cartQty < existingItem.quantity) {
          existingItem.cartQty += 1;
        }
      } else {
        state.items.push({
          ...product,
          cartQty: 1, // ✅ separate cart quantity
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    increaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (!item) return;

      if (item.cartQty < item.quantity) {
        item.cartQty += 1;
      }
    },

    decreaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (item && item.cartQty > 1) {
        item.cartQty -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
