import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchProducts, updateProduct } from "../redux/products/productsSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const UpdateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.products.items.find((p) => p._id === id)
  );

  useEffect(() => {
    if (!product) dispatch(fetchProducts());
  }, [dispatch, product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    dispatch(updateProduct({ id, formData }))
      .unwrap()
      .then(() => {
        toast.success("Product updated successfully!");
        navigate(-1); 
      })
      .catch((err) => {
        toast.error(err || "Failed to update product");
      });
  };

  if (!product)
    return (
      <motion.p
        className="flex items-center justify-center min-h-screen text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading...
      </motion.p>
    );

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-base-200 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="card w-full max-w-md shadow-lg bg-base-100"
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="card-body">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-outline mb-2 w-fit"
          >
            ← Back
          </button>

          <h2 className="card-title justify-center mb-2">
            Update Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="text-xs font-bold px-1">Product Name</label>
            <input
              name="name"
              defaultValue={product.name}
              className="input border border-black w-full"
            />

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold px-1">Base Price</label>
                <input
                  name="basePrice"
                  defaultValue={product.basePrice}
                  placeholder="e.g. $50"
                  type="text"
                  className="input border border-black w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold px-1">Sale Price</label>
                <input
                  name="price"
                  defaultValue={product.price}
                  type="number"
                  className="input border border-black w-full"
                />
              </div>
            </div>

            <label className="text-xs font-bold px-1">Stock Quantity</label>
            <input
              name="quantity"
              defaultValue={product.quantity}
              type="number"
              className="input border border-black w-full"
            />

            <label className="text-xs font-bold px-1">Category</label>
            <input
              name="categoryName"
              defaultValue={product.category?.name}
              className="input border border-black w-full"
            />

            <label className="text-xs font-bold px-1">Sub Category</label>
            <input
              name="subCategory"
              defaultValue={product.category?.subCategory}
              className="input border border-black w-full"
            />

            <label className="text-xs font-bold px-1">Description</label>
            <textarea
              name="description"
              defaultValue={product.description}
              className="textarea border border-black w-full h-24"
            />

            <label className="text-xs font-bold px-1">Replace Image (Optional)</label>
            <input type="file" name="file" className="file-input file-input-bordered w-full" />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn btn-primary w-full mt-4"
            >
              Save Changes
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UpdateProductPage;