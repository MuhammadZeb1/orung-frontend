import { ConfirmDialog } from "../common/ConfirmDialog";
import { Button } from "./ui/button";
import { FaTrash, FaEdit, FaBox } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../redux/products/productsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleDelete = () => {
    dispatch(deleteProduct(product._id));
    toast.success("Product deleted successfully ✅", {
      position: "bottom-right",
    });
    // Animate out
    setIsVisible(false);
  };

  const handleUpdate = () => {
    navigate(`/updateProduct/${product._id}`);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="card bg-base-100 shadow-lg border border-base-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* IMAGE */}
          <figure className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-52 w-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <span className="badge badge-primary absolute top-3 right-3 text-lg font-bold px-3 py-4 shadow-md">
              ${product.price}
            </span>
          </figure>

          {/* BODY */}
          <div className="card-body p-5 flex flex-col justify-between">
            <div>
              <h2 className="card-title text-xl font-bold line-clamp-1">{product.name}</h2>

              {/* CATEGORY & SUBCATEGORY */}
              {product.category && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="badge badge-outline badge-sm text-gray-500">
                    {product.category.name}
                    {product.category.subCategory
                      ? ` / ${product.category.subCategory}`
                      : ""}
                  </span>
                </div>
              )}

              {/* QUANTITY DISPLAY - Added this to show stock levels */}
              <div className="mt-3 flex items-center gap-2">
                <FaBox className="text-gray-400 text-xs" />
                <span className="text-sm font-medium text-gray-600">Stock:</span>
                <span className={`badge badge-sm font-bold ${
                  product.quantity > 5 ? "badge-ghost" : "badge-warning"
                }`}>
                  {product.quantity} units
                </span>
              </div>

              {/* DESCRIPTION */}
              {product.description && (
                <p className="text-gray-500 mt-3 line-clamp-2 text-sm italic">
                  {product.description}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="card-actions justify-end mt-6 gap-2 border-t pt-4">
              {/* DELETE */}
              <ConfirmDialog
                trigger={
                  <button
                    className="btn btn-error btn-sm btn-outline flex items-center gap-1"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                }
                title="Delete Product?"
                description="This will permanently delete this product from your inventory."
                onConfirm={handleDelete}
                confirmText="Delete"
                cancelText="Cancel"
              />

              {/* UPDATE */}
              <Button
                size="sm"
                onClick={handleUpdate}
                className="flex items-center gap-1"
              >
                <FaEdit size={12} /> Update
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  
  );
};

export default ProductCard;