import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaShoppingBag, FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import orungLogo from "../assets/Orung Logo.png";

const categories = ["Men", "Women", "Kids"];

const categoryLinkClass = ({ isActive }) =>
  `rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-[#f1f1f1] text-[#171715] ring-1 ring-inset ring-slate-300"
      : "text-[#171715] hover:bg-slate-100"
  }`;

export default function UserNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((count, item) => count + (item.cartQty ?? 1), 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#171715]/10 bg-white shadow-sm">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 py-3 sm:px-6">
        <Link to="/" className="flex w-fit items-center gap-2" aria-label="Orung home">
          <img className="size-9 rounded-full object-contain sm:size-10" src={orungLogo} alt="" />
          <span className="text-lg font-bold tracking-[.12em] text-[#121212] sm:text-xl">ORUNG</span>
        </Link>

        <nav className="col-span-3 row-start-2 flex items-center justify-center gap-1 pt-2 sm:gap-3 sm:pt-3 md:col-span-1 md:col-start-2 md:row-start-1 md:pt-0" aria-label="Shop categories">
          {categories.map((category) => (
            <NavLink
              key={category}
              to={`/user/products/${category.toLowerCase()}`}
              className={categoryLinkClass}
            >
              {category}
            </NavLink>
          ))}
        </nav>

        <div className="col-start-3 row-start-1 flex items-center justify-self-end gap-2 sm:gap-3">
          <NavLink
            to="/cart"
            aria-label={`Shopping bag${itemCount ? `, ${itemCount} items` : ""}`}
            className={({ isActive }) =>
              `relative grid size-10 place-items-center rounded-full transition hover:bg-slate-100 ${
                isActive ? "text-[#ff4e1f]" : "text-[#171715]"
              }`
            }
          >
            <FaShoppingCart size={17} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#ff4e1f] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </NavLink>

          {token ? (
            <>
              <NavLink
                to="/customer/purchases"
                className={({ isActive }) =>
                  `hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-slate-100 sm:inline-flex ${
                    isActive ? "text-[#ff4e1f]" : "text-[#171715]"
                  }`
                }
              >
                <FaShoppingBag /> <span className="hidden lg:inline">My Orders</span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <FaSignOutAlt size={16} />
                <span className="sr-only">Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-slate-100 sm:inline-flex ${
                    isActive ? "text-[#ff4e1f]" : "text-[#171715]"
                  }`
                }
              >
                <FaUser /> <span className="hidden lg:inline">Sign up</span>
              </NavLink>
              <NavLink
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#171715] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#ff4e1f] sm:px-4 sm:text-sm"
              >
                <FaSignInAlt /> <span>Sign in</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
