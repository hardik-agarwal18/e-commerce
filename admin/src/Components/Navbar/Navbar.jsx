import React from "react";
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">
        <img src={navlogo} alt="" className="nav-logo" />
      </Link>
      <img src={navProfile} alt="" className="nav-profile" />
    </div>
  );
};

export default Navbar;
