import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, ImagePlus, Link2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  affiliateUrl: "",
};
const pageSize = 10;

function AffiliateManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/affiliate-products", {
          params: { page, limit: pageSize, search: debouncedSearch, category, sort },
        });
        if (!active) return;
        const data = response.data?.data;
        setProducts(data?.products || []);
        setPages(data?.pagination?.pages || 0);
        setTotal(data?.pagination?.total || 0);
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || "Failed to fetch affiliate products.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, [page, debouncedSearch, category, sort, refreshKey]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.put(`/affiliate-products/${editingId}`, payload);
        toast.success("Affiliate product updated.");
      } else {
        await api.post("/affiliate-products", payload);
        toast.success("Affiliate product added.");
      }
      resetForm();
      setRefreshKey((key) => key + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price ?? ""),
      category: product.category,
      imageUrl: product.imageUrl,
      affiliateUrl: product.affiliateUrl,
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product._id);
    try {
      await api.delete(`/affiliate-products/${product._id}`);
      toast.success("Affiliate product deleted.");
      if (editingId === product._id) resetForm();
      if (products.length === 1 && page > 1) setPage((current) => current - 1);
      else setRefreshKey((key) => key + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-[#171715] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#ff4e1f]">
              <ArrowLeft size={16} /> Storefront
            </Link>
            <p className="font-mono text-[10px] font-semibold tracking-[.18em] text-[#ff4e1f]">ADMIN / CATALOG</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Affiliate products</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Add and maintain the curated partner products shown in the public affiliate collection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/affiliate"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-[#171715]"
            >
              Preview storefront <ExternalLink size={16} />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (editingId) {
                  setEditingId(null);
                  setForm(emptyForm);
                  setFormOpen(true);
                  return;
                }
                setFormOpen((isOpen) => !isOpen);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171715] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4e1f]"
            >
              <Plus size={17} /> Add product
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#171715]/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.13em] text-slate-400">Total listings</p>
            <p className="mt-2 text-3xl font-black">{total}</p>
          </div>
          <div className="rounded-2xl border border-[#171715]/10 bg-white p-5 shadow-sm sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[.13em] text-slate-400">Collection status</p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {total > 0 ? "Your affiliate picks are available on the public storefront." : "Add your first product to populate the public storefront."}
            </p>
          </div>
        </div>

        {formOpen && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-[#171715]/10 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[.16em] text-[#ff4e1f]">{editingId ? "UPDATE LISTING" : "NEW LISTING"}</p>
                <h2 className="mt-1 text-xl font-bold">{editingId ? "Edit affiliate product" : "Add an affiliate product"}</h2>
              </div>
              <button type="button" onClick={resetForm} aria-label="Close form" className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-x-5 gap-y-4 p-5 sm:grid-cols-2 sm:p-7">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Product name</span>
                <input name="name" value={form.name} onChange={updateForm} placeholder="Example: Premium Smart Watch" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10" required />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea name="description" value={form.description} onChange={updateForm} rows={3} placeholder="What makes this product worth a look?" className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Price (USD)</span>
                <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={updateForm} placeholder="299.99" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Category</span>
                <input name="category" value={form.category} onChange={updateForm} placeholder="Electronics" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10" required />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Product image URL</span>
                <span className="relative block">
                  <ImagePlus size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" name="imageUrl" value={form.imageUrl} onChange={updateForm} placeholder="https://example.com/product-image.jpg" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10" required />
                </span>
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Partner / affiliate URL</span>
                <span className="relative block">
                  <Link2 size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" name="affiliateUrl" value={form.affiliateUrl} onChange={updateForm} placeholder="https://partner-site.com/product" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10" required />
                </span>
              </label>
              {form.imageUrl && (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 sm:col-span-2">
                  <img src={form.imageUrl} alt="Product preview" className="size-14 rounded-lg bg-white object-cover" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-600">Image preview</p>
                    <p className="truncate text-xs text-slate-400">{form.imageUrl}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 pt-1 sm:col-span-2">
                <button type="submit" disabled={submitting} className="rounded-full bg-[#171715] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? "Saving..." : editingId ? "Save changes" : "Create listing"}
                </button>
                <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#171715] hover:text-[#171715]">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#171715]/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <h2 className="text-xl font-bold">All listings</h2>
              <p className="mt-1 text-sm text-slate-500">Search, filter and update your partner catalog.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(190px,1fr)_170px_190px]">
              <label className="relative">
                <span className="sr-only">Search product names</span>
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#ff4e1f]" />
              </label>
              <label>
                <span className="sr-only">Filter category</span>
                <input type="search" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#ff4e1f]" />
              </label>
              <label>
                <span className="sr-only">Sort listings</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#ff4e1f]">
                  <option value="latest">Newest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-500" role="status">Loading affiliate listings...</div>
          ) : products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-2xl font-bold">{total ? "No matching listings" : "Your catalog is ready for its first product"}</p>
              <p className="mt-2 text-sm text-slate-500">{total ? "Change your search or filters to see more results." : "Create a listing and it will appear in the public affiliate collection."}</p>
              {!total && <button type="button" onClick={() => setFormOpen(true)} className="mt-5 rounded-full bg-[#171715] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff4e1f]">Add your first product</button>}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#faf9f6] text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.imageUrl} alt="" className="size-12 rounded-lg bg-slate-100 object-cover" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-800">{product.name}</p>
                              <p className="mt-1 max-w-[330px] truncate text-xs text-slate-400">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{product.category}</span>
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-semibold">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <a href={product.affiliateUrl} target="_blank" rel="noreferrer" aria-label={`Open ${product.name} affiliate link`} className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#171715] hover:text-[#171715]">
                              <ExternalLink size={15} />
                            </a>
                            <button type="button" onClick={() => handleEdit(product)} aria-label={`Edit ${product.name}`} className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#171715] hover:text-[#171715]">
                              <Pencil size={15} />
                            </button>
                            <button type="button" onClick={() => handleDelete(product)} disabled={deletingId === product._id} aria-label={`Delete ${product.name}`} className="grid size-9 place-items-center rounded-lg border border-red-100 text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
                <p className="text-xs text-slate-500">
                  Showing {total ? ((page - 1) * pageSize) + 1 : 0}–{Math.min(page * pageSize, total)} of {total} listings
                </p>
                {pages > 1 && (
                  <div className="flex items-center justify-end gap-3">
                    <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">
                      <ArrowLeft size={14} /> Previous
                    </button>
                    <span className="text-xs font-medium text-slate-500">{page} / {pages}</span>
                    <button type="button" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">
                      Next <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default AffiliateManagement;
