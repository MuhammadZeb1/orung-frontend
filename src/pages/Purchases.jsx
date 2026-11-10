import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerPurchases, deleteCustomerPurchase } from "../redux/purchase/purchaseSlice";
import { toast } from "react-toastify";
import { ArrowLeft, MapPin, Package, Phone, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(price) || 0);

const Purchases = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { customerPurchases: purchases, loading, error } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchCustomerPurchases())
      .unwrap()
      .catch((requestError) => toast.error(`Failed to fetch your orders: ${requestError}`));
  }, [dispatch, token]);

  const handleDelete = (id) => {
    if (!window.confirm("Remove this order from your history?")) return;
    dispatch(deleteCustomerPurchase(id))
      .unwrap()
      .then(() => toast.success("Order removed from your history."))
      .catch((requestError) => toast.error(`Could not remove this order: ${requestError}`));
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 text-[#171715] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#ff4e1f]">
          <ArrowLeft size={16} /> Continue browsing
        </Link>

        <header className="mb-8 border-b border-[#171715]/15 pb-6">
          <p className="font-mono text-[10px] font-semibold tracking-[.2em] text-[#ff4e1f]">YOUR ACCOUNT</p>
          <h1 className="mt-2 font-display text-5xl font-black uppercase leading-none sm:text-6xl">My orders</h1>
          <p className="mt-3 text-sm text-slate-500">A history of the orders placed from your account.</p>
        </header>

        {!token ? (
          <section className="flex min-h-[45vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-[#171715] text-white">
              <ShoppingBag size={26} />
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold">Sign in to view your orders</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your order history is private to your Orung account.
            </p>
            <Link to="/login" className="mt-6 rounded-full bg-[#171715] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff4e1f]">
              Sign in
            </Link>
          </section>
        ) : loading ? (
          <div className="rounded-2xl border border-[#171715]/10 bg-white px-6 py-16 text-center text-sm text-slate-500" role="status">
            Loading your orders...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center" role="alert">
            <p className="font-semibold text-red-800">{error}</p>
            <button type="button" onClick={() => dispatch(fetchCustomerPurchases())} className="mt-4 rounded-full bg-[#171715] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff4e1f]">
              Try again
            </button>
          </div>
        ) : !purchases || purchases.length === 0 ? (
          <section className="flex min-h-[45vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-[#171715] text-white">
              <ShoppingBag size={26} />
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold">No orders yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Orders you place while signed in will appear here, visible only to your account.
            </p>
            <Link to="/user/products/women" className="mt-6 rounded-full bg-[#171715] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff4e1f]">
              Explore the collection
            </Link>
          </section>
        ) : (
          <section className="space-y-4" aria-label="Orders belonging to your account">
            <div className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-500">
              <Package size={15} /> {purchases.length} {purchases.length === 1 ? "order item" : "order items"} in your history
            </div>
            {purchases.map((purchase) => {
              const productName = purchase.product?.name || "Product no longer available";
              const productImage = purchase.product?.image;
              const delivery = purchase.userInfo;
              return (
                <article key={purchase._id} className="overflow-hidden rounded-2xl border border-[#171715]/10 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#fffdfa] px-5 py-4 sm:px-6">
                    <div>
                      <p className="font-mono text-[9px] font-semibold tracking-[.15em] text-slate-400">ORDER REFERENCE</p>
                      <p className="mt-1 font-mono text-xs font-bold">#{purchase._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono text-[9px] font-semibold tracking-[.15em] text-slate-400">ORDERED</p>
                        <p className="mt-1 text-xs font-medium text-slate-600">
                          {purchase.purchasedAt ? new Date(purchase.purchasedAt).toLocaleString() : "Date unavailable"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(purchase._id)}
                        aria-label={`Remove order ${purchase._id}`}
                        title="Remove from order history"
                        className="grid size-9 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:px-6">
                    {productImage ? (
                      <img src={productImage} alt={productName} className="h-28 w-24 shrink-0 rounded-xl bg-[#eeece6] object-cover" />
                    ) : (
                      <div className="grid h-28 w-24 shrink-0 place-items-center rounded-xl bg-[#eeece6] text-slate-400">
                        <Package size={24} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[9px] font-semibold tracking-[.14em] text-[#ff4e1f]">ORDER ITEM</p>
                      <h2 className="mt-1 text-lg font-bold">{productName}</h2>
                      <p className="mt-2 text-sm text-slate-500">Quantity: {purchase.quantity ?? 1}</p>
                      <p className="mt-1 text-xs font-medium text-emerald-700">
                        Cash on delivery · {purchase.paymentStatus === "paid" ? "Paid" : "Payment due on delivery"}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-mono text-lg font-black">{formatPrice(purchase.price)}</p>
                      <p className="mt-1 text-xs text-slate-400">Item total</p>
                    </div>
                  </div>

                  {delivery && (delivery.address || delivery.city || delivery.postalCode || delivery.phone) && (
                    <div className="flex flex-col gap-2 border-t border-slate-100 bg-[#faf9f6] px-5 py-4 text-xs leading-5 text-slate-500 sm:px-6">
                      {(delivery.address || delivery.city || delivery.postalCode) && (
                        <p className="flex items-start gap-2">
                          <MapPin size={15} className="mt-0.5 shrink-0 text-[#ff4e1f]" />
                          <span>Delivered to: {[delivery.address, delivery.city, delivery.postalCode].filter(Boolean).join(", ")}</span>
                        </p>
                      )}
                      {delivery.phone && (
                        <p className="flex items-center gap-2">
                          <Phone size={14} className="shrink-0 text-[#ff4e1f]" />
                          <span>Contact: {delivery.phone}</span>
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default Purchases;
