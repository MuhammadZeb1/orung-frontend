import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { createPurchaseThunk } from "../redux/checkout/checkoutSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce(
    (sum, item) => sum + item.price * (item.cartQty ?? 1),
    0
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({

    address: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    // if (!userInfo.name || !userInfo.email || !userInfo.address) {
    //   toast.error("Please fill in all required fields", { position: "top-center" });
    //   return;
    // }

    if (items.length === 0) {
      toast.error("Your cart is empty!", { position: "top-center" });
      return;
    }

    try {
      // Prepare payload
      const payload = { items, userInfo };

      // Dispatch Redux thunk to create purchase
      await dispatch(createPurchaseThunk(payload)).unwrap();

      toast.success("Purchase successful!", { position: "top-center" });

      // Clear cart
      dispatch(clearCart());

      // Navigate to purchases page
      navigate("/purchases");
    } catch (error) {
      toast.error("Purchase failed: " + error, { position: "top-center" });
    }
  };

  if (items.length === 0) {
    return <p className="text-center p-10 font-bold text-xl">Your cart is empty!</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* User Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={userInfo.address}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:col-span-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={userInfo.city}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={userInfo.postalCode}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        <div className="border rounded p-4">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>{item.name} x {item.cartQty ?? 1}</span>
              <span>${(item.price * (item.cartQty ?? 1)).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-bold transition-all"
      >
        Pay ${total.toFixed(2)}
      </button>
    </div>
  );
};

export default Checkout;
