import { useDispatch } from "react-redux";
import { addProduct } from "../redux/products/productsSlice";
import { useRef } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const bulkInputRef = useRef(null);

  // 1️⃣ Handle Single Product
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    dispatch(addProduct(formData))
      .unwrap()
      .then(() => {
        toast.success("Product created successfully!");
        e.target.reset();
      })
      .catch((err) => toast.error(err?.message || err));
  };

  // 2️⃣ Handle Bulk Upload
  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    dispatch(addProduct(formData))
      .unwrap()
      .then(() => {
        toast.success("Bulk products uploaded successfully!");
        e.target.value = null;
      })
      .catch((err) => toast.error(err?.message || err));
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-base-200 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="card w-full max-w-md bg-base-100 shadow-xl"
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">
            Add New Products
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              placeholder="Name"
              className="input border border-black w-full"
              required
            />

            <div className="flex gap-2">
              {/* ✅ Base Price Added */}
              <input
                name="basePrice"
                placeholder="Base Price (e.g. $10)"
                type="text"
                className="input border border-black w-1/2"
              />
              
              <input
                name="price"
                placeholder="Sale Price"
                type="number"
                className="input border border-black w-1/2"
                required
              />
            </div>

            <input
              name="quantity"
              placeholder="Quantity"
              type="number"
              className="input border border-black w-full"
              required
            />

            <input
              name="categoryName"
              placeholder="Category"
              className="input border border-black w-full"
              required
            />

            <input
              name="subCategory"
              placeholder="Sub Category"
              className="input border border-black w-full"
            />

            <textarea
              name="description"
              placeholder="Description"
              className="textarea border border-black w-full"
            />

            <div className="form-control">
              <label className="label text-xs font-bold">
                Product Image
              </label>
              <input
                type="file"
                name="file"
                className="file-input file-input-bordered w-full"
                accept="image/*"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn btn-primary w-full"
            >
              Create Single Product
            </motion.button>
          </form>

          <div className="divider text-gray-400">OR</div>

          <input
            type="file"
            ref={bulkInputRef}
            onChange={handleBulkFileChange}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => bulkInputRef.current.click()}
            className="btn btn-outline btn-secondary w-full"
          >
            Upload CSV / Excel Bundle
          </motion.button>

          <p className="text-[10px] text-center mt-2 opacity-60">
            Ensure your spreadsheet includes a "basePrice" column.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateProduct;