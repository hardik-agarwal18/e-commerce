import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem("auth-token");

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={navlogo} alt="" className="nav-logo" />
      </Link>
      {loggedIn ? (
        <button onClick={handleLogout} className="nav-logout-btn">
          Logout
        </button>
      ) : (
        <img src={navProfile} alt="" className="nav-profile" />
      )}
    </div>
  );
};

export default Navbar;
