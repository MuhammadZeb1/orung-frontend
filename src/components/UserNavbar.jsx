import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
      {/* Logo */}
      <div className="flex-1">
        <span className="text-2xl font-bold text-blue-600">MyProject</span>
      </div>

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