import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaUser, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaShoppingCart, 
  FaShoppingBag // New icon for Purchases
} from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import orungLogo from "../assets/Orung Logo.png";

export default function UserNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const categories = ["Men", "Women", "Kids"];

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <Link to="/" className="flex flex-1 items-center gap-2" aria-label="Orung home">
        <img className="size-10 rounded-full object-contain" src={orungLogo} alt="" />
        <span className="text-xl font-bold tracking-[.12em] text-[#121212]">ORUNG</span>
      </Link>

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="gap-2 flex items-center">
          
          {/* Home */}
          <NavigationMenuItem>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(navigationMenuTriggerStyle(), "flex gap-2 items-center", isActive && "bg-accent font-bold")
              }
            >
              <FaHome /> Home
            </NavLink>
          </NavigationMenuItem>

          {/* Cart link */}
          <NavigationMenuItem>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                cn(navigationMenuTriggerStyle(), "flex gap-2 items-center", isActive && "bg-accent font-bold")
              }
            >
              <FaShoppingCart /> Cart
              {cartItems.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
                  {cartItems.length}
                </span>
              )}
            </NavLink>
          </NavigationMenuItem>

          {token ? (
            <>
              {/* --- NEW: MY ORDERS / PURCHASES --- */}
              <NavigationMenuItem>
                <NavLink
                  to="/customer/purchases"
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(), 
                      "flex gap-2 items-center", 
                      isActive && "bg-blue-50 text-blue-600 font-bold"
                    )
                  }
                >
                  <FaShoppingBag /> My Orders
                </NavLink>
              </NavigationMenuItem>

              {/* Direct categories */}
              {categories.map((cat) => (
                <NavigationMenuItem key={cat}>
                  <NavLink
                    to={`/user/products/${cat.toLowerCase()}`}
                    className={({ isActive }) =>
                      cn(navigationMenuTriggerStyle(), isActive && "bg-accent font-bold")
                    }
                  >
                    {cat}
                  </NavLink>
                </NavigationMenuItem>
              ))}

              {/* Logout */}
              <NavigationMenuItem>
                <button
                  onClick={handleLogout}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex gap-2 items-center hover:bg-red-100 text-red-600"
                  )}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    cn(navigationMenuTriggerStyle(), isActive && "bg-accent font-bold")
                  }
                >
                  <FaUser /> Signup
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(navigationMenuTriggerStyle(), isActive && "bg-accent font-bold")
                  }
                >
                  <FaSignInAlt /> Login
                </NavLink>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}