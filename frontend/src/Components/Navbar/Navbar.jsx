import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";

import logo from "../../Assets/logo.png";
import cart_icon from "../../Assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../../Assets/nav_dropdown.png";
import { axiosInstance } from "../../lib/axios";

//Navbar component to display the website logo and navigation links.
const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth-token");
  const cartItemCount = getTotalCartItems();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      // Show a subtle message or redirect to login
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
        <Link
          to={isLoggedIn ? "/cart" : "/login"}
          className={`cart-icon-container ${!isLoggedIn ? "cart-disabled" : ""}`}
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
