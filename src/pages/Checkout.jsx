import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { createPurchaseThunk } from "../redux/checkout/checkoutSlice";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Banknote, Check, LockKeyhole, MapPin, Phone, ShieldCheck, ShoppingBag } from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(price) || 0);

const Checkout = () => {
  const items = useSelector((state) => state.cart.items);
  const { token } = useSelector((state) => state.auth);
  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.cartQty ?? 1),
    0
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((previous) => ({ ...previous, [name]: value }));
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }

    if (!token) {
      toast.info("Please sign in before placing your order.");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(createPurchaseThunk({ items, userInfo, paymentMethod: "cash_on_delivery" })).unwrap();
      toast.success("Order placed successfully.");
      dispatch(clearCart());
      navigate("/customer/purchases");
    } catch (error) {
      toast.error(`Order could not be placed: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#faf9f6] px-5 py-12 text-[#171715] sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#ff4e1f]">
            <ArrowLeft size={16} /> Back to bag
          </Link>
          <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
            <span className="grid size-20 place-items-center rounded-full bg-[#171715] text-white">
              <ShoppingBag size={30} strokeWidth={1.5} />
            </span>
            <h1 className="mt-8 font-display text-4xl font-black uppercase">Your bag is empty</h1>
            <p className="mt-3 text-sm text-slate-500">Add something you love before heading to checkout.</p>
            <Link to="/user/products/women" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#171715] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#ff4e1f]">
              Explore the collection <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 text-[#171715] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/cart" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#ff4e1f]">
          <ArrowLeft size={16} /> Return to bag
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#171715]/15 pb-6">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[.2em] text-[#ff4e1f]">ALMOST YOURS</p>
            <h1 className="mt-2 font-display text-5xl font-black uppercase leading-none sm:text-6xl">Checkout</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 ring-1 ring-[#171715]/10">
            <LockKeyhole size={14} className="text-emerald-600" /> Secure checkout
          </div>
        </div>

        <form onSubmit={handlePayment} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-12">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#171715]/10 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
                <span className="grid size-9 place-items-center rounded-full bg-[#171715] text-white">
                  <MapPin size={17} />
                </span>
                <div>
                  <h2 className="font-bold">Delivery details</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Where should we send your order?</p>
                </div>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Phone number</span>
                  <span className="relative block">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+1 555 123 4567"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                      required
                    />
                  </span>
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Street address</span>
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    placeholder="House number and street"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">City</span>
                  <input
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Your city"
                    value={userInfo.city}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Postal code</span>
                  <input
                    type="text"
                    name="postalCode"
                    autoComplete="postal-code"
                    placeholder="Postal / ZIP code"
                    value={userInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                    required
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#ff4e1f]/30 bg-white p-5 sm:p-7" aria-labelledby="payment-heading">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-50 text-[#ff4e1f]">
                  <Banknote size={18} />
                </span>
                <div>
                  <h2 id="payment-heading" className="font-bold">Payment method</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Pay with cash when your order arrives. No payment is collected online.
                  </p>
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#ff4e1f]/25 bg-orange-50/60 p-4">
                    <span className="grid size-5 place-items-center rounded-full border-[6px] border-[#ff4e1f] bg-white" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold text-[#171715]">Cash on delivery</span>
                      <span className="mt-0.5 block text-xs text-slate-500">Pay the order total to the delivery person.</span>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#171715]/10 bg-white p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <h2 className="font-bold">Order protected</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Review your delivery details and order summary before placing your order.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="rounded-2xl border border-[#171715]/10 bg-white p-5 sm:p-7 lg:sticky lg:top-28">
            <p className="font-mono text-[10px] font-semibold tracking-[.18em] text-[#ff4e1f]">YOUR ORDER</p>
            <h2 className="mt-2 text-2xl font-black">The good stuff.</h2>

            <ul className="mt-6 max-h-[360px] space-y-4 overflow-y-auto pr-1">
              {items.map((item) => {
                const quantity = item.cartQty ?? 1;
                return (
                  <li key={item._id} className="flex gap-3">
                    <div className="relative size-[68px] shrink-0 overflow-hidden rounded-lg bg-[#eeece6]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "https://placehold.co/160x160/f1efe9/777?text=Orung";
                        }}
                      />
                      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#171715] text-[10px] font-bold text-white">
                        {quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold leading-5">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.category?.name || "ORUNG EDIT"}</p>
                    </div>
                    <span className="shrink-0 pt-0.5 font-mono text-xs font-bold">
                      {formatPrice((Number(item.price) || 0) * quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
              <div className="flex justify-between gap-4 text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-[#171715]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-500">
                <span>Payment</span>
                <span className="text-xs">Cash on delivery</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-5">
              <span className="font-bold">Total</span>
              <span className="font-mono text-lg font-black">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#171715] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing your order..." : <>Place order <ArrowRight size={17} /></>}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-5 text-slate-400">
              <Check size={13} className="text-emerald-600" /> Pay in cash when your order is delivered.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
