import { useState } from "react";
import "./css/Login.css";
import { axiosInstance } from "../../lib/axios";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function", formData);

    try {
      const response = await axiosInstance.post("/auth/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem("auth-token", response.data.token);
        window.location.replace("/");
      } else {
        alert(response.data.errors || response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Admin Login</h1>
        <div className="loginsignup-fields">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Email Address"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
          />
        </div>
        <button
          onClick={() => {
            login();
          }}
        >
          Continue
        </button>
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By Continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
