import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../redux/products/productsSlice";
import authReducer from "../redux/auth/authSlice";
import cartReducer from "../redux/cart/cartSlice";
import checkoutReducer from "../redux/checkout/checkoutSlice";
import purchaseReducer from "../redux/purchase/purchaseSlice";


export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    purchase: purchaseReducer,
  },
});
