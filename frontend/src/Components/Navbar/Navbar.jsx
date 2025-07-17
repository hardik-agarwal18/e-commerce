import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";

import logo from "../../Assets/logo.png";
import cart_icon from "../../Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../../Assets/nav_dropdown.png";
import { axiosInstance } from "../../lib/axios";

//Navbar component to display the website logo and navigation links.
const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
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
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>SHOPPER</p>
      </div>
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
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="Cart Icon" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
