import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/products/productsSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  FileSpreadsheet,
  ImagePlus,
  PackagePlus,
  Upload,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialForm = {
  name: "",
  basePrice: "",
  price: "",
  quantity: "",
  categoryName: "",
  subCategory: "",
  description: "",
};

const CreateProduct = () => {
  const dispatch = useDispatch();
  const bulkInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      toast.error("Choose a product image before creating the listing.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("file", imageFile);

    setSubmitting(true);
    try {
      await dispatch(addProduct(formData)).unwrap();
      toast.success("Product created successfully.");
      resetForm();
    } catch (error) {
      toast.error(error?.message || error || "Could not create the product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setBulkUploading(true);
    try {
      const result = await dispatch(addProduct(formData)).unwrap();
      const count = result.count || result.createdProducts?.length || 0;
      toast.success(`${count} ${count === 1 ? "product" : "products"} imported successfully.`);
    } catch (error) {
      toast.error(error?.message || error || "Could not import this file.");
    } finally {
      setBulkUploading(false);
      event.target.value = "";
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#171715] outline-none transition placeholder:text-slate-400 focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10";

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-[#171715] sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link to="/admin/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#ff4e1f]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[.2em] text-[#ff4e1f]">ADMIN / INVENTORY</p>
            <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">Create product</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Add a product to your catalog. It will be available in the storefront as soon as it’s saved.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#171715]/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
            <PackagePlus size={15} className="text-[#ff4e1f]" /> New inventory listing
          </span>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="overflow-hidden rounded-2xl border border-[#171715]/10 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <h2 className="text-lg font-bold">Product details</h2>
              <p className="mt-1 text-xs text-slate-500">Fields marked required must be completed.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Product name <span className="text-[#ff4e1f]">*</span></span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Relaxed cotton overshirt"
                  className={inputClass}
                  autoComplete="off"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Sale price <span className="text-[#ff4e1f]">*</span></span>
                <span className="relative block">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`${inputClass} pl-8`}
                    required
                  />
                </span>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Base price</span>
                <span className="relative block">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                  <input
                    name="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.basePrice}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={`${inputClass} pl-8`}
                  />
                </span>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Stock quantity <span className="text-[#ff4e1f]">*</span></span>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Available units"
                  className={inputClass}
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Category <span className="text-[#ff4e1f]">*</span></span>
                <select
                  name="categoryName"
                  value={form.categoryName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Subcategory</span>
                <input
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  placeholder="Example: Outerwear, Dresses, Sneakers"
                  className={inputClass}
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the details, materials, and fit..."
                  className={`${inputClass} resize-y`}
                />
              </label>

              <div className="space-y-2 sm:col-span-2">
                <span className="block text-sm font-semibold text-slate-700">Product image <span className="text-[#ff4e1f]">*</span></span>
                <input
                  ref={imageInputRef}
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  className="sr-only"
                  id="product-image"
                />
                {imagePreview ? (
                  <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <img src={imagePreview} alt="Product preview" className="size-20 rounded-lg bg-white object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700">{imageFile?.name}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB` : ""}
                      </p>
                      <label htmlFor="product-image" className="mt-2 inline-flex cursor-pointer text-xs font-bold text-[#d9461d] hover:underline">
                        Replace image
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        if (imageInputRef.current) imageInputRef.current.value = "";
                      }}
                      aria-label="Remove selected image"
                      className="grid size-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="product-image"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-[#ff4e1f] hover:bg-orange-50/40"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-white text-[#ff4e1f] shadow-sm"><ImagePlus size={20} /></span>
                    <span className="mt-3 text-sm font-semibold text-slate-700">Choose a product image</span>
                    <span className="mt-1 text-xs text-slate-400">Image files only</span>
                  </label>
                )}
              </div>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5 sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171715] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating product..." : <>Create product <ArrowRight size={16} /></>}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#171715] hover:text-[#171715] disabled:opacity-50"
                >
                  Clear form
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#171715]/10 bg-white p-5 shadow-sm sm:p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-[#ff4e1f]"><FileSpreadsheet size={19} /></span>
              <h2 className="mt-4 text-lg font-bold">Import a catalog</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Upload a CSV or Excel file to add multiple products in one step.
              </p>
              <input
                type="file"
                ref={bulkInputRef}
                onChange={handleBulkFileChange}
                accept=".csv,.xlsx,.xls"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bulkInputRef.current?.click()}
                disabled={bulkUploading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#171715] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload size={16} /> {bulkUploading ? "Importing products..." : "Upload CSV / Excel"}
              </button>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Include columns for name, description, basePrice, price, quantity, categoryName, subCategory, and image.
              </p>
            </section>

            <section className="rounded-2xl bg-[#171715] p-5 text-white sm:p-6">
              <p className="font-mono text-[9px] font-semibold tracking-[.18em] text-[#ff7952]">QUICK CHECK</p>
              <h2 className="mt-2 text-lg font-bold">Before you publish</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex gap-2"><span className="text-[#ff7952]">01</span> Use a clear product name.</li>
                <li className="flex gap-2"><span className="text-[#ff7952]">02</span> Check price and stock quantity.</li>
                <li className="flex gap-2"><span className="text-[#ff7952]">03</span> Choose a good-quality image.</li>
              </ul>
            </section>
          </aside>
        </div>
      </motion.div>
    </main>
  );
};

export default CreateProduct;
