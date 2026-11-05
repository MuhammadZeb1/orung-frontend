import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, ExternalLink, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const pageSize = 12;

function AffiliateProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingId, setOpeningId] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/affiliate-products", {
          params: { page, limit: pageSize, search: debouncedSearch, category, sort },
        });
        if (!active) return;
        const data = response.data?.data;
        setProducts(data?.products || []);
        setPages(data?.pagination?.pages || 0);
        setTotal(data?.pagination?.total || 0);
      } catch (requestError) {
        if (!active) return;
        const message = requestError.response?.data?.message || "Could not load affiliate products.";
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [page, debouncedSearch, category, sort, retryCount]);

  const handleBuy = async (id) => {
    setOpeningId(id);
    try {
      const response = await api.post(`/affiliate-products/${id}/buy`);
      const target = new URL(response.data.affiliateUrl);
      if (target.protocol !== "https:" && target.protocol !== "http:") {
        throw new Error("This product has an invalid external link.");
      }
      window.location.assign(target.href);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || requestError.message || "Could not open this product.");
      setOpeningId(null);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171715]">
      <section className="relative overflow-hidden bg-[#171715] px-5 py-16 text-[#faf9f6] sm:px-8 sm:py-24">
        <div className="absolute -right-36 -top-60 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,78,31,.32),transparent_68%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link to="/" className="mb-12 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft size={16} /> Back to Orung
          </Link>
          <p className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[.2em] text-[#ff7952]">
            <Sparkles size={14} /> THE ORUNG EDIT
          </p>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-display text-[clamp(48px,8vw,96px)] font-black uppercase leading-[.86] tracking-[-.03em]">
                Good finds.<br /><span className="text-[#ff4e1f]">Better links.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                Discover our curated affiliate picks. Explore something you love and continue to our partner to learn more.
              </p>
            </div>
            <div className="border-l border-white/20 pl-5 text-sm text-white/65">
              <span className="block font-display text-4xl font-black text-white">{total}</span>
              curated {total === 1 ? "find" : "finds"}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14" aria-label="Affiliate products">
        <div className="mb-8 grid gap-3 rounded-2xl border border-[#171715]/10 bg-white p-4 shadow-sm md:grid-cols-[minmax(220px,1fr)_minmax(180px,.6fr)_220px] md:p-5">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search curated products"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
            />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <input
              type="search"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Filter by category"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
            />
          </label>
          <label>
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
            >
              <option value="latest">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] rounded-xl bg-slate-200" />
                <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center" role="alert">
            <p className="font-semibold text-red-800">{error}</p>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mt-4 rounded-full bg-[#171715] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff4e1f]">
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="font-display text-3xl font-bold">No matches this time.</p>
            <p className="mt-2 text-sm text-slate-500">Try another search or clear the category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("latest");
              }}
              className="mt-5 rounded-full border border-[#171715] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#171715] hover:text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {products.length} of {total} {total === 1 ? "product" : "products"}</span>
              {(search || category) && <span className="hidden sm:inline">Filtered collection</span>}
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article key={product._id} className="group min-w-0">
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-[#eeece6]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "https://placehold.co/600x750/f1efe9/777?text=Orung+Edit";
                      }}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[.14em] text-[#171715]">
                      {product.category}
                    </span>
                    <button
                      type="button"
                      disabled={openingId === product._id}
                      onClick={() => handleBuy(product._id)}
                      className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-[#171715] px-4 py-3 text-xs font-bold uppercase tracking-[.08em] text-white transition hover:bg-[#ff4e1f] disabled:opacity-70"
                    >
                      {openingId === product._id ? "Opening partner..." : <>View at partner <ExternalLink size={14} /></>}
                    </button>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-bold">{product.name}</h2>
                      <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{product.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-bold">{formatPrice(product.price)}</span>
                  </div>
                </article>
              ))}
            </div>
            {pages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-5" aria-label="Product pages">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold transition hover:border-[#171715] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={15} /> Previous
                </button>
                <span className="text-sm font-medium text-slate-500">Page {page} of {pages}</span>
                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => setPage((current) => Math.min(pages, current + 1))}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold transition hover:border-[#171715] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ArrowRight size={15} />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
      <section className="border-t border-[#171715]/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:px-8">
          <p className="text-slate-500">Some links may be affiliate links. Orung may earn a commission at no extra cost to you.</p>
          <Link to="/" className="inline-flex items-center gap-2 font-semibold transition hover:text-[#ff4e1f]">
            Back to the collection <ArrowUp size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AffiliateProducts;
