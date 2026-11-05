import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ initialize navigate

  const total = items.reduce(
    (sum, item) => sum + item.price * (item.cartQty ?? 1),
    0
  );

  const handleIncrease = (item) => {
    const currentQty = item.cartQty ?? 1;
    const stock = Number(item.quantity) ?? 0;

    if (stock <= 0) {
      toast.error("This product is out of stock!", {
        position: "top-center",
      });
      return;
    }

    if (currentQty >= stock) {
      toast.error(`Maximum available stock is ${stock}`, {
        position: "top-center",
      });
      return;
    }

    dispatch(increaseQty(item._id));
  };

  if (items.length === 0) {
    return (
      <p className="text-center p-10 font-bold text-xl">
        Cart Khali Hai
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.map((item) => {
        const currentQty = item.cartQty ?? 1;
        const stock = Number(item.quantity) ?? 0;

        const isOutOfStock = stock === 0;
        const isLimitReached = currentQty === stock && stock > 0;

        return (
          <div key={item._id} className="flex gap-4 items-center border-b py-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>

              {/* Stock Status */}
              <div className="mt-1">
                {isOutOfStock ? (
                  <span className="badge bg-red-200 text-red-800 px-2 py-0.5 text-xs font-bold rounded">
                    OUT OF STOCK
                  </span>
                ) : isLimitReached ? (
                  <span className="badge bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-bold rounded">
                    LIMIT REACHED
                  </span>
                ) : (
                  <span className="badge bg-green-100 text-green-700 px-2 py-0.5 text-xs font-bold rounded">
                    IN STOCK: {stock}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex gap-3 items-center mt-3">
                <button
                  onClick={() => dispatch(decreaseQty(item._id))}
                  disabled={currentQty <= 1}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-40"
                >
                  -
                </button>

                <span className="font-bold w-6 text-center">
                  {currentQty}
                </span>

                {isOutOfStock ? (
                  <span className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded">
                    OUT
                  </span>
                ) : (
                  <button
                    onClick={() => handleIncrease(item)}
                    disabled={isLimitReached}
                    className={`w-8 h-8 flex items-center justify-center border rounded transition-all ${
                      isLimitReached
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-90"
                    }`}
                  >
                    +
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => dispatch(removeFromCart(item._id))}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        );
      })}

      {/* Footer */}
      <div className="mt-8 border-t pt-6 text-right">
        <h2 className="text-2xl font-bold">
          Total: ${total.toFixed(2)}
        </h2>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => dispatch(clearCart())}
            className="px-5 py-2 border border-red-500 text-red-500 rounded font-bold hover:bg-red-100"
          >
            Clear Cart
          </button>

          {/* ✅ Checkout Button */}
          <button
            onClick={() => navigate("/checkout")} // navigate to Checkout page
            className="px-10 py-2 bg-black text-white rounded font-bold hover:bg-gray-800 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
