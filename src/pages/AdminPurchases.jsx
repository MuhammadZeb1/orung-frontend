import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPurchases, deleteAdminPurchase } from "../redux/purchase/purchaseSlice";
import { toast } from "react-toastify";
import {
  ArrowDownRight,
  CalendarDays,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(price) || 0);

const formatDate = (date) => {
  if (!date) return "Date unavailable";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : parsedDate.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const AdminPurchases = () => {
  const dispatch = useDispatch();
  const { adminPurchases: purchases = [], loading, error } = useSelector((state) => state.purchase);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminPurchases())
      .unwrap()
      .catch((requestError) => toast.error(`Failed to fetch admin purchases: ${requestError}`));
  }, [dispatch]);

  const filteredPurchases = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return purchases;
    return purchases.filter((purchase) => [
      purchase.product?.name,
      purchase.customer?.name,
      purchase.customer?.email,
      purchase._id,
    ].some((value) => String(value || "").toLowerCase().includes(searchTerm)));
  }, [purchases, search]);

  const totalRevenue = purchases.reduce((sum, purchase) => sum + (Number(purchase.price) || 0), 0);
  const totalUnits = purchases.reduce((sum, purchase) => sum + (Number(purchase.quantity) || 0), 0);

  const handleDelete = async (purchase) => {
    if (!window.confirm(`Delete the order for "${purchase.product?.name || "this product"}"? This cannot be undone.`)) return;
    setDeletingId(purchase._id);
    try {
      await dispatch(deleteAdminPurchase(purchase._id)).unwrap();
      toast.success("Order record deleted.");
    } catch (requestError) {
      toast.error(`Delete failed: ${requestError}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-[#171715] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[.2em] text-[#ff4e1f]">ADMIN / SALES</p>
            <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">Order management</h1>
            <p className="mt-3 text-sm text-slate-500">Review customer orders and their delivery details.</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search orders</span>
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer or product"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ff4e1f] focus:ring-4 focus:ring-[#ff4e1f]/10"
            />
          </label>
        </header>

        <section className="mb-7 grid gap-4 sm:grid-cols-3" aria-label="Order summary">
          <div className="rounded-2xl border border-[#171715]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">Order items</p>
              <span className="grid size-9 place-items-center rounded-xl bg-orange-50 text-[#ff4e1f]"><ShoppingBag size={17} /></span>
            </div>
            <p className="mt-3 text-3xl font-black">{purchases.length}</p>
            <p className="mt-1 text-xs text-slate-500">Customer purchase records</p>
          </div>
          <div className="rounded-2xl border border-[#171715]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">Units ordered</p>
              <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><Package size={17} /></span>
            </div>
            <p className="mt-3 text-3xl font-black">{totalUnits}</p>
            <p className="mt-1 text-xs text-slate-500">Across all recorded orders</p>
          </div>
          <div className="rounded-2xl border border-[#171715]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-400">Order value</p>
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><ArrowDownRight size={17} /></span>
            </div>
            <p className="mt-3 text-3xl font-black">{formatPrice(totalRevenue)}</p>
            <p className="mt-1 text-xs text-slate-500">Combined recorded order totals</p>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-[#171715]/10 bg-white px-6 py-20 text-center text-sm text-slate-500" role="status">
            Loading customer orders...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center" role="alert">
            <p className="font-semibold text-red-800">{error}</p>
            <button type="button" onClick={() => dispatch(fetchAdminPurchases())} className="mt-4 rounded-full bg-[#171715] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff4e1f]">
              Try again
            </button>
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#171715] text-white"><Package size={23} /></span>
            <h2 className="mt-5 text-xl font-bold">{purchases.length ? "No matching orders" : "No orders yet"}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {purchases.length ? "Try another product name, customer name, or email." : "Customer orders will appear here."}
            </p>
          </div>
        ) : (
          <section className="space-y-5" aria-label="Customer order cards">
            {filteredPurchases.map((purchase) => {
              const customerPurchase = purchase.customerPurchase;
              const delivery = customerPurchase?.userInfo;
              const customerName = purchase.customer?.name || "Customer";
              return (
                <article key={purchase._id} className="overflow-hidden rounded-2xl border border-[#171715]/10 bg-white shadow-sm transition hover:shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#fffdfa] px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <div>
                        <p className="font-mono text-[9px] font-semibold tracking-[.15em] text-slate-400">ORDER REFERENCE</p>
                        <p className="mt-1 font-mono text-xs font-bold">#{purchase._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <span className="hidden h-8 w-px bg-slate-200 sm:block" />
                      <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} /> {formatDate(purchase.purchasedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-amber-700">
                        Order received
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(purchase)}
                        disabled={deletingId === purchase._id}
                        aria-label={`Delete order ${purchase._id}`}
                        className="grid size-9 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(250px,.8fr)]">
                    <div className="flex gap-4 p-5 sm:gap-6 sm:p-6">
                      {purchase.product?.image ? (
                        <img src={purchase.product.image} alt={purchase.product?.name || ""} className="h-28 w-24 shrink-0 rounded-xl bg-[#eeece6] object-cover sm:h-32 sm:w-28" />
                      ) : (
                        <div className="grid h-28 w-24 shrink-0 place-items-center rounded-xl bg-[#eeece6] text-slate-400 sm:h-32 sm:w-28"><Package size={25} /></div>
                      )}
                      <div className="min-w-0 flex-1 self-center">
                        <p className="font-mono text-[9px] font-semibold tracking-[.15em] text-[#ff4e1f]">PRODUCT</p>
                        <h2 className="mt-1 text-lg font-bold leading-snug">{purchase.product?.name || "Product no longer available"}</h2>
                        <p className="mt-2 text-sm text-slate-500">Quantity: <span className="font-semibold text-slate-700">{purchase.quantity}</span></p>
                        <p className="mt-2 font-mono text-lg font-black">{formatPrice(purchase.price)}</p>
                        <p className="mt-1 text-xs font-medium text-emerald-700">
                          Cash on delivery · {customerPurchase?.paymentStatus === "paid" ? "Paid" : "Payment due on delivery"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 bg-[#faf9f6] p-5 sm:p-6 md:border-l md:border-t-0">
                      <p className="mb-4 font-mono text-[9px] font-semibold tracking-[.15em] text-slate-400">CUSTOMER & DELIVERY</p>
                      <div className="space-y-3">
                        <p className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                          <UserRound size={15} className="shrink-0 text-[#ff4e1f]" /> {customerName}
                        </p>
                        {purchase.customer?.email && (
                          <p className="flex min-w-0 items-center gap-2.5 text-sm text-slate-600">
                            <Mail size={15} className="shrink-0 text-slate-400" />
                            <a href={`mailto:${purchase.customer.email}`} className="truncate hover:text-[#ff4e1f]">{purchase.customer.email}</a>
                          </p>
                        )}
                        {delivery?.phone && (
                          <p className="flex items-center gap-2.5 text-sm text-slate-600">
                            <Phone size={15} className="shrink-0 text-slate-400" />
                            <a href={`tel:${delivery.phone}`} className="hover:text-[#ff4e1f]">{delivery.phone}</a>
                          </p>
                        )}
                        {(delivery?.address || delivery?.city || delivery?.postalCode) ? (
                          <p className="flex items-start gap-2.5 text-sm leading-5 text-slate-600">
                            <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                            <span>{[delivery.address, delivery.city, delivery.postalCode].filter(Boolean).join(", ")}</span>
                          </p>
                        ) : (
                          <p className="flex items-center gap-2.5 text-xs text-slate-400">
                            <MapPin size={15} className="shrink-0" /> No delivery details saved
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminPurchases;
