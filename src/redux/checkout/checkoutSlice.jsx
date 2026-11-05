import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as checkoutService from "./checkoutService";

// create purchase
export const createPurchaseThunk = createAsyncThunk(
  "checkout/createPurchase",
  async (cartItems, { rejectWithValue }) => {
    try {
      return await checkoutService.createPurchase(cartItems);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// fetch user purchases
export const fetchUserPurchases = createAsyncThunk(
  "checkout/fetchUserPurchases",
  async (_, { rejectWithValue }) => {
    try {
      return await checkoutService.getUserPurchases();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// fetch admin purchases
export const fetchAdminPurchases = createAsyncThunk(
  "checkout/fetchAdminPurchases",
  async (_, { rejectWithValue }) => {
    try {
      return await checkoutService.getAdminPurchases();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    purchases: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetCheckout: (state) => {
      state.purchases = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create purchase
      .addCase(createPurchaseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(createPurchaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch user purchases
      .addCase(fetchUserPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchUserPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch admin purchases
      .addCase(fetchAdminPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchAdminPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
