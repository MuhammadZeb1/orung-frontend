import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice"; 

const UserCardProduct = ({ product }) => {
  const dispatch = useDispatch();
  
  // 1. Get current cart items from Redux to check quantity already added
  const cartItems = useSelector((state) => state.cart.items);
  console.log("cartItems",cartItems)
  
  // 2. Find this specific product in the cart
  const cartItem = cartItems.find((item) => item._id === product._id);
  const qtyInCart = cartItem ? (cartItem.cartQty || cartItem.quantity || 0) : 0;

  // 3. Logic: Compare cart quantity vs total available stock
  const isOutOfStock = product.quantity <= 0;
  const isLimitReached = qtyInCart >= product.quantity;
  // console.table(isLimitReached,isOutOfStock)

  const handleAddToCart = () => {
    if (!isLimitReached) {
      
      dispatch(addToCart(product));
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md bg-white transition-all">
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      {/* PRODUCT TITLE */}
      <h3 className="text-md font-bold mb-1">{product.name}</h3>
      
      {/* CATEGORY & SUBCATEGORY */}
      {product.category && (
        <p className="text-xs text-blue-600 font-medium mb-1">
          {product.category.name} {product.category.subCategory ? `• ${product.category.subCategory}` : ""}
        </p>
      )}

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>

      <div className="flex items-center justify-between mb-4">
        {/* PRICE */}
        <span className="font-bold text-lg text-gray-900">
          ${product.price.toFixed(2)}
        </span>

        {/* QUANTITY DISPLAY */}
        <div className="flex flex-col items-end">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm ${
            isOutOfStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {isOutOfStock ? "Out of Stock" : `Stock: ${product.quantity}`}
          </span>
        </div>
      </div>

      {/* UPDATED BUTTON LOGIC */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isLimitReached}
        className={`w-full py-2.5 rounded-md font-semibold text-white transition-all ${
          (isOutOfStock || isLimitReached)
            ? "bg-gray-300 cursor-not-allowed" 
            : product.quantity < 10 
              ? "bg-orange-500 hover:bg-orange-600 active:scale-95" 
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
        }`}
      >
        {isOutOfStock 
          ? "Sold Out" 
          : isLimitReached 
            ? "Limit in Cart Reached" 
            : product.quantity < 10 
              ? `Only ${product.quantity} Left - Add` 
              : "Add to Cart"}
      </button>
    </div>
  );
};

export default UserCardProduct;