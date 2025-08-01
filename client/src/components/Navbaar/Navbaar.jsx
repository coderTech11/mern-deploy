import "./Navbaar.css";
import { ProductContext } from "../../context/ProductContext";
import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartContext } from "../../context/CartContext";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbaar({ sidebarOpen, setSidebarOpen }) {
  const {
    productData,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
  } = useContext(ProductContext);

  const category = productData
    ? [...new Set(productData.map((item) => item.category))]
    : [];

  const { isAuthenticated, logoutuser, userRole } = useContext(AuthContext);

  const { cartItems } = useContext(CartContext); //Access cart items
  const cartCount = cartItems?.length || 0;

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const drawerWidth = 240;

  return (
    <nav
      className="product-filter"
      style={{
        marginLeft: isAdminRoute && sidebarOpen ? drawerWidth : 0,
      }}
    >
      {/* Close icon for admin routes */}
      {isAdminRoute && !sidebarOpen && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label={sidebarOpen ? "close sidebar" : "open sidebar"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ color: "#fff", mr: 1, ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Ecommerce title shifted to right when sidebar is open */}
      <h1
        className="product-title"
        style={{
          marginLeft: isAdminRoute && sidebarOpen ? 10 : 0,
          transition: "margin-left 0.3s",
        }}
      >
        Ecommerce
      </h1>

      {/* User nav fields only if not on admin route */}
      {!isAdminRoute && (
        <div className="sort">
          {location.pathname === "/" && (
            <div className="collection-sort">
              <label htmlFor="filter">Filter by:</label>
              {!isLoading ? (
                !error ? (
                  <select
                    id="filter"
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value || "All")
                    }
                  >
                    <option value="All">All</option>
                    {category.map((category, index) => (
                      <option value={category} key={index}>
                        {category}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select id="filter">
                    <option value="">Error loading categories</option>
                  </select>
                )
              ) : (
                <select id="filter">
                  <option value="">Loading...</option>
                </select>
              )}
            </div>
          )}

          {/* Signup */}
          <div className="right">
            {!isAuthenticated && (
              <div className="nav_btn">
                <NavLink to="/signup" style={{ color: "#fff" }}>
                  Sign up
                </NavLink>
              </div>
            )}
          </div>

          {/* Signin */}
          <div className="right">
            {!isAuthenticated && (
              <div className="nav_btn">
                <NavLink to="/signin" style={{ color: "#fff" }}>
                  Sign in
                </NavLink>
              </div>
            )}
          </div>

          {userRole !== "admin" && (
            <>
              <NavLink to="/" className="nav_btn">
                <button style={{ color: "#fff" }}>Home</button>
              </NavLink>

              {/* Cart */}
              {isAuthenticated && (
                <NavLink to="/cart" className="cart-icon">
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon style={{ color: "#fff" }} />
                  </Badge>
                  <p style={{ color: "#fff" }}>Cart</p>
                </NavLink>
              )}

              {/* Purchases */}
              {isAuthenticated && (
                <NavLink to="/purchases" className="cart-icon">
                  <p style={{ color: "#fff" }}>Purchases</p>
                </NavLink>
              )}

              {/* Logout */}
              {isAuthenticated && (
                <div className="nav_btn">
                  <button onClick={logoutuser} style={{ color: "#fff" }}>
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
