import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaUser, 
  FaSignInAlt, 
  FaTachometerAlt, 
  FaPlus, 
  FaSignOutAlt, 
  FaChartBar, // New icon for Analytics
  FaHistory   // New icon for Purchases
} from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";

function AdminNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

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

      {/* Navigation */}
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          
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

          {token ? (
            <>
              {/* --- NEW: ANALYTICS DASHBOARD --- */}
              <NavigationMenuItem>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(),
                      "flex gap-2 items-center",
                      isActive && "bg-blue-50 text-blue-600 font-bold"
                    )
                  }
                >
                  <FaChartBar /> Analytics
                </NavLink>
              </NavigationMenuItem>

              {/* --- NEW: PURCHASE HISTORY --- */}
              <NavigationMenuItem>
                <NavLink
                  to="/admin/purchases"
                  className={({ isActive }) =>
                    cn(
                      navigationMenuTriggerStyle(),
                      "flex gap-2 items-center",
                      isActive && "bg-blue-50 text-blue-600 font-bold"
                    )
                  }
                >
                  <FaHistory /> Purchases
                </NavLink>
              </NavigationMenuItem>

              {/* Dashboard Dropdown (Categories) */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex gap-2 items-center">
                  <FaTachometerAlt /> Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 md:w-[250px] lg:w-[300px]">
                    <li className="mb-2 font-medium text-sm text-muted-foreground px-2">
                      Browse Inventory
                    </li>
                    {categories.map((cat) => (
                      <li key={cat}>
                        <NavigationMenuLink asChild>
                          <NavLink
                            to={`/dashboard/category/${cat.toLowerCase()}`}
                            className={({ isActive }) =>
                              cn(
                                "block select-none rounded-md p-3 transition-colors hover:bg-accent",
                                isActive && "bg-accent font-bold"
                              )
                            }
                          >
                            <div className="text-sm font-medium">{cat}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Manage {cat} products
                            </p>
                          </NavLink>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="/createProduct"
                  className={({ isActive }) =>
                    cn(navigationMenuTriggerStyle(), "flex gap-2 items-center", isActive && "bg-accent font-bold")
                  }
                >
                  <FaPlus /> Create Product
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button
                  onClick={handleLogout}
                  className={cn(navigationMenuTriggerStyle(), "flex gap-2 items-center hover:bg-red-100 text-red-600")}
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
                    cn(navigationMenuTriggerStyle(), "flex gap-2 items-center", isActive && "bg-accent font-bold")
                  }
                >
                  <FaUser /> Signup
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(navigationMenuTriggerStyle(), "flex gap-2 items-center", isActive && "bg-accent font-bold")
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

export default AdminNavbar;