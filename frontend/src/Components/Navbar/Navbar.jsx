import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";

import logo from "../../Assets/logo.png";
import cart_icon from "../../Assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../../Assets/nav_dropdown.png";
import { axiosInstance } from "../../lib/axios";
import { toast } from "sonner";

//Navbar component to display the website logo and navigation links.
const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, getWishlistCount } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth-token");
  const cartItemCount = getTotalCartItems();
  const wishlistCount = getWishlistCount();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("Please login to view cart");
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      // Call backend logout API to clear HTTP-only cookies
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove local token and redirect, even if API call fails
      localStorage.removeItem("auth-token");
      window.location.replace("/");
    }
  };
  return (
    <div className="navbar">
      <Link className="nav-logo" to="/">
        <img src={logo} alt="Logo" />
        <p className="shopper">SHOPPER</p>
      </Link>

      <img
        className="nav-dropdown"
        src={nav_dropdown}
        alt=""
        onClick={dropdown_toggle}
      />
      <ul ref={menuRef} className="nav-menu">
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("mens");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("womens");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/womens">
            Women
          </Link>
          {menu === "womens" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("kids");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button onClick={handleLogout}>
            <span>Logout</span>
          </button>
        ) : (
          <Link to="/login">
            <button>
              <span>Login</span>
            </button>
          </Link>
        )}
        {isLoggedIn && (
          <Link
            to="/wishlist"
            className="wishlist-icon-container"
            title="View Wishlist"
          >
            <svg
              className="wishlist-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={wishlistCount > 0 ? "#ff4141" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <div className="nav-wishlist-badge">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </div>
            )}
          </Link>
        )}
        {isLoggedIn && (
          <Link
            to="/orders"
            className="orders-icon-container"
            title="View Orders"
          >
            <svg
              className="orders-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>
        )}
        <Link
          to={isLoggedIn ? "/cart" : "/login"}
          className="cart-icon-container"
          onClick={handleCartClick}
          title={isLoggedIn ? "View Cart" : "Login to view cart"}
        >
          <img src={cart_icon} alt="Cart Icon" className="cart-icon" />
          {cartItemCount > 0 && (
            <div className="nav-cart-badge">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
