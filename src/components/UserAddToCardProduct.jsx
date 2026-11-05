import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cart/cartSlice";

const UserCardProduct = ({ product }) => {
  const dispatch = useDispatch();

  // Logic to determine the stock message and color
  // const isOutOfStock = product.quantity <= 0;

  // const isLowStock = product.quantity > 0 && product.quantity < 10;
  // console.log(isLowStock,isOutOfStock)

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md bg-white flex flex-col h-full">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <h3 className="font-bold text-lg">{product.name}</h3>
      
      {/* Category display from your nested schema */}
      {product.category && (
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
          {product.category.name} {product.category.subCategory ? `| ${product.category.subCategory}` : ""}
        </p>
      )}

      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
        {product.description}
      </p>

      <div className="flex justify-between items-center mb-3 mt-auto">
        <span className="font-bold text-xl text-gray-900">
          ${product.price}
        </span>

        {/* Dynamic Quantity Message */}
        <span className={`text-xs font-bold px-2 py-1 rounded ${
          isOutOfStock ? "bg-red-100 text-red-600" : 
          isLowStock ? "bg-orange-100 text-orange-600" : 
          "bg-green-100 text-green-600"
        }`}>
          {isOutOfStock ? "Sold Out" : isLowStock ? `Only ${product.quantity} left!` : "In Stock"}
        </span>
      </div>

      <button
        onClick={() => dispatch(addToCart(product))}
        disabled={isOutOfStock}
        className={`w-full py-2 rounded font-semibold transition-all ${
          isOutOfStock 
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        }`}
      >
        {isOutOfStock ? "Temporarily Unavailable" : "Add to Cart"}
      </button>
    </div>
  )
};

export default UserCardProduct;