import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(price) || 0);

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.cartQty ?? 1),
    0
  );
  const itemCount = items.reduce((sum, item) => sum + (item.cartQty ?? 1), 0);

  const handleIncrease = (item) => {
    const currentQty = item.cartQty ?? 1;
    const stock = Number(item.quantity) || 0;

    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    if (currentQty >= stock) {
      toast.error(`Maximum available stock is ${stock}.`);
      return;
    }

    dispatch(increaseQty(item._id));
  };

  const handleClearCart = () => {
    if (window.confirm("Remove all items from your bag?")) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#faf9f6] px-5 py-12 text-[#171715] sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#ff4e1f]">
            <ArrowLeft size={16} /> Continue browsing
          </Link>
          <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
            <span className="grid size-20 place-items-center rounded-full bg-[#171715] text-white">
              <ShoppingBag size={30} strokeWidth={1.5} />
            </span>
            <p className="mt-8 font-mono text-[10px] font-semibold tracking-[.2em] text-[#ff4e1f]">YOUR ORUNG BAG</p>
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[.9]">Nothing in here.<br />Yet.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              Your next favorite is waiting. Explore the collection and add something you love.
            </p>
            <Link
              to="/user/products/women"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#171715] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#ff4e1f]"
            >
              Explore the collection <ArrowRight size={17} />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 text-[#171715] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#ff4e1f]">
          <ArrowLeft size={16} /> Continue browsing
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#171715]/15 pb-6">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[.2em] text-[#ff4e1f]">YOUR ORUNG BAG</p>
            <h1 className="mt-2 font-display text-5xl font-black uppercase leading-none sm:text-6xl">Shopping bag</h1>
          </div>
          <p className="font-mono text-xs tracking-[.08em] text-slate-500">
            {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
          <section aria-label="Items in your shopping bag" className="rounded-2xl border border-[#171715]/10 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <h2 className="text-sm font-bold uppercase tracking-[.1em]">Your items</h2>
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs font-semibold text-slate-400 transition hover:text-red-600"
              >
                Clear bag
              </button>
            </div>

            <ul className="divide-y divide-slate-100">
              {items.map((item) => {
                const currentQty = item.cartQty ?? 1;
                const stock = Number(item.quantity) || 0;
                const isOutOfStock = stock <= 0;
                const isLimitReached = currentQty >= stock && stock > 0;

                return (
                  <li key={item._id} className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                    <Link
                      to={`/user/products/${item.category?.name?.toLowerCase() || "women"}`}
                      className="block h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eeece6] sm:h-40 sm:w-32"
                      aria-label={`View ${item.name}`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover transition duration-500 hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "https://placehold.co/400x500/f1efe9/777?text=Orung";
                        }}
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row">
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3 sm:block">
                          <div>
                            <p className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-[.15em] text-slate-400">
                              {item.category?.name || "ORUNG EDIT"}
                            </p>
                            <h3 className="text-base font-bold leading-snug sm:text-lg">{item.name}</h3>
                          </div>
                          <p className="shrink-0 font-mono text-sm font-bold sm:hidden">{formatPrice(Number(item.price) * currentQty)}</p>
                        </div>

                        <div className="mt-2">
                          {isOutOfStock ? (
                            <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold tracking-[.1em] text-red-600">OUT OF STOCK</span>
                          ) : isLimitReached ? (
                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold tracking-[.1em] text-amber-700">MAX AVAILABLE</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold tracking-[.1em] text-emerald-700">
                              <span className="size-1.5 rounded-full bg-emerald-500" /> IN STOCK
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div className="inline-flex h-9 items-center rounded-full border border-slate-200">
                            <button
                              type="button"
                              onClick={() => dispatch(decreaseQty(item._id))}
                              disabled={currentQty <= 1}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="grid size-9 place-items-center rounded-full text-slate-600 transition hover:text-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center font-mono text-xs font-bold" aria-label="Quantity">{currentQty}</span>
                            <button
                              type="button"
                              onClick={() => handleIncrease(item)}
                              disabled={isLimitReached || isOutOfStock}
                              aria-label={`Increase ${item.name} quantity`}
                              className="grid size-9 place-items-center rounded-full text-slate-600 transition hover:text-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-red-600"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>

                      <p className="hidden shrink-0 pt-1 font-mono text-sm font-bold sm:block">
                        {formatPrice(Number(item.price) * currentQty)}
                        <span className="mt-1 block text-right text-[10px] font-normal text-slate-400">{formatPrice(item.price)} each</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3 border-t border-slate-100 bg-[#faf9f6] px-5 py-4 text-xs text-slate-500 sm:px-7">
              <LockKeyhole size={15} className="shrink-0" />
              Your bag is reserved while you complete checkout.
            </div>
          </section>

          <aside className="rounded-2xl border border-[#171715]/10 bg-white p-5 sm:p-7 lg:sticky lg:top-28">
            <p className="font-mono text-[10px] font-semibold tracking-[.18em] text-[#ff4e1f]">ORDER SUMMARY</p>
            <h2 className="mt-2 text-2xl font-black">A good choice.</h2>

            <div className="mt-7 space-y-4 border-b border-slate-100 pb-5 text-sm">
              <div className="flex justify-between gap-4 text-slate-500">
                <span>Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}</span>
                <span className="font-mono font-semibold text-[#171715]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-500">
                <span>Shipping & taxes</span>
                <span className="text-xs">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between gap-4 py-5">
              <span className="font-bold">Estimated total</span>
              <span className="font-mono text-lg font-black">{formatPrice(total)}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#171715] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#ff4e1f]"
            >
              Continue to checkout <ArrowRight size={17} />
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
              Shipping and applicable taxes will be confirmed during checkout.
            </p>

            <Link to="/user/products/women" className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-[#ff4e1f]">
              <ArrowLeft size={14} /> Keep exploring
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
