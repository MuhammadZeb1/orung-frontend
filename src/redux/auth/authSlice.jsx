import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Get token & role from localStorage
const token = localStorage.getItem("token") || null;
const role = localStorage.getItem("role") || null;

// Async Thunk: Normal login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", formData);
      return { token: res.data.token, role: res.data.user.role };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk: Google login
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (credential, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/google", { token: credential });
      return { token: res.data.token, role: res.data.user.role };
    } catch (err) {
      return rejectWithValue("Google login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token,
    role: role,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      
    },
  },
  extraReducers: (builder) => {
    builder
      // Normal login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
       
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", action.payload.role);
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
       
      })

      // Google login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
       
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
