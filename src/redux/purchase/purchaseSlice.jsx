import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ------------------- ASYNC THUNKS -------------------

// 1. Create a purchase (Checkout)
export const createPurchase = createAsyncThunk(
  "purchase/create",
  async (items, { rejectWithValue }) => {
    try {
      const response = await api.post("/purchases/customer", { items });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Purchase failed");
    }
  }
);

// 2. Fetch Customer History
export const fetchCustomerPurchases = createAsyncThunk(
  "purchase/fetchCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/purchases/customer");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch history");
    }
  }
);

// 3. Fetch Admin History (All Records)
export const fetchAdminPurchases = createAsyncThunk(
  "purchase/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/purchases/admin");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch admin data");
    }
  }
);

// 4. ✅ NEW: Fetch Admin Analytics (Daily, Weekly, Monthly)
export const fetchAdminAnalytics = createAsyncThunk(
  "purchase/fetchAnalytics",
  async (period, { rejectWithValue }) => {
    try {
      // period can be 'daily', 'weekly', or 'monthly'
      const response = await api.get(`/purchases/admin/analytics?period=${period}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch analytics");
    }
  }
);

// 5. Delete Purchase by Admin
export const deleteAdminPurchase = createAsyncThunk(
  "purchase/deleteAdmin",
  async (purchaseId, { rejectWithValue }) => {
    try {
      await api.delete(`/purchases/admin/${purchaseId}`);
      return purchaseId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// 6. Delete Purchase by Customer
export const deleteCustomerPurchase = createAsyncThunk(
  "purchase/deleteCustomer",
  async (purchaseId, { rejectWithValue }) => {
    try {
      await api.delete(`/purchases/customer/${purchaseId}`);
      return purchaseId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// ------------------- SLICE -------------------

const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    customerPurchases: [],
    adminPurchases: [],
    analytics: {
      summary: { totalSales: 0, totalProfit: 0, totalLoss: 0 },
      bestSellingProducts: [],
      totalTransactions: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearPurchaseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. ALL .addCase MUST GO FIRST
      .addCase(fetchCustomerPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.customerPurchases = action.payload;
      })
      .addCase(fetchAdminPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.adminPurchases = action.payload;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(deleteAdminPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.adminPurchases = state.adminPurchases.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteCustomerPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.customerPurchases = state.customerPurchases.filter(
          (item) => item._id !== action.payload
        );
      })

      // 2. ALL .addMatcher MUST GO AFTER .addCase
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearPurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;