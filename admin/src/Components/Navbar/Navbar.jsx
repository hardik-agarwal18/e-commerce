import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
// import navProfile from "../../assets/nav-profile.svg";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem("auth-token");

  const handleLogout = () => {
    axiosInstance.post("/admin/logout").then(() => {
      localStorage.removeItem("auth-token");
      navigate("/login");
    });
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
        <>
          <Link to="/login" className="nav-login-btn">
            <button className="nav-login-btn">Login</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
