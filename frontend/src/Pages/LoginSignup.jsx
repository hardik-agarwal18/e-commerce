import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { axiosInstance } from "../lib/axios";

export const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Clear messages when switching between login/signup
  useEffect(() => {
    setError("");
    setSuccess("");
    setValidationErrors({});
  }, [state]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (state === "Sign Up" && !formData.name.trim()) {
      errors.name = "Name is required";
    } else if (state === "Sign Up" && formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!agreeTerms) {
      errors.terms = "You must agree to the terms and privacy policy";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const login = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem("auth-token", response.data.token);
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } else {
        setError(
          response.data.errors || response.data.message || "Login failed",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting...");
        localStorage.setItem("auth-token", response.data.token);
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } else {
        setError(
          response.data.errors || response.data.message || "Signup failed",
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <div className="loginsignup-header">
          <h1>{state}</h1>
          <p className="loginsignup-subtitle">
            {state === "Login"
              ? "Welcome back! Please login to your account"
              : "Create an account to get started"}
          </p>
        </div>

        {error && (
          <div className="message-box error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                fill="currentColor"
              />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="message-box success-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                fill="currentColor"
              />
            </svg>
            {success}
          </div>
        )}

        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <div className="input-group">
              <div
                className={`input-wrapper ${validationErrors.name ? "error" : ""}`}
              >
                <svg
                  className="input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 0C6.69 0 4 2.69 4 6C4 9.31 6.69 12 10 12C13.31 12 16 9.31 16 6C16 2.69 13.31 0 10 0ZM10 20C5.33 20 1.67 18.33 0 16C0.08 13.34 6.67 11.67 10 11.67C13.33 11.67 19.92 13.34 20 16C18.33 18.33 14.67 20 10 20Z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={changeHandler}
                  placeholder="Your Name"
                  disabled={loading}
                />
              </div>
              {validationErrors.name && (
                <span className="error-text">{validationErrors.name}</span>
              )}
            </div>
          )}

          <div className="input-group">
            <div
              className={`input-wrapper ${validationErrors.email ? "error" : ""}`}
            >
              <svg
                className="input-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M18 4H2C0.9 4 0.01 4.9 0.01 6L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V6C20 4.9 19.1 4 18 4ZM18 8L10 11L2 8V6L10 9L18 6V8Z"
                  fill="currentColor"
                />
              </svg>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                placeholder="Email Address"
                disabled={loading}
              />
            </div>
            {validationErrors.email && (
              <span className="error-text">{validationErrors.email}</span>
            )}
          </div>

          <div className="input-group">
            <div
              className={`input-wrapper ${validationErrors.password ? "error" : ""}`}
            >
              <svg
                className="input-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M15 6.67H14.2V5C14.2 2.24 11.96 0 9.2 0C6.44 0 4.2 2.24 4.2 5V6.67H3.4C2.63 6.67 2 7.3 2 8.07V17.4C2 18.17 2.63 18.8 3.4 18.8H15C15.77 18.8 16.4 18.17 16.4 17.4V8.07C16.4 7.3 15.77 6.67 15 6.67ZM9.2 14.33C8.43 14.33 7.8 13.7 7.8 12.93C7.8 12.16 8.43 11.53 9.2 11.53C9.97 11.53 10.6 12.16 10.6 12.93C10.6 13.7 9.97 14.33 9.2 14.33ZM12.2 6.67H6.2V5C6.2 3.34 7.54 2 9.2 2C10.86 2 12.2 3.34 12.2 5V6.67Z"
                  fill="currentColor"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={changeHandler}
                placeholder="Password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 4C5 4 1.73 8.11 1 10C1.73 11.89 5 16 10 16C15 16 18.27 11.89 19 10C18.27 8.11 15 4 10 4ZM10 14C7.79 14 6 12.21 6 10C6 7.79 7.79 6 10 6C12.21 6 14 7.79 14 10C14 12.21 12.21 14 10 14ZM10 8C8.9 8 8 8.9 8 10C8 11.1 8.9 12 10 12C11.1 12 12 11.1 12 10C12 8.9 11.1 8 10 8Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 6C12.21 6 14 7.79 14 10C14 10.35 13.94 10.69 13.84 11L16.31 13.47C17.42 12.53 18.28 11.36 18.82 10C17.73 7.39 14.1 4 10 4C8.91 4 7.88 4.19 6.93 4.54L8.84 6.45C9.15 6.35 9.49 6.29 9.84 6.29L10 6ZM1.27 1.27L3.28 3.28L3.74 3.74C2.45 4.82 1.5 6.09 1 7.5C2.09 10.11 5.72 13.5 9.82 13.5C11.1 13.5 12.31 13.26 13.41 12.84L13.59 13.02L16.72 16.15L18 14.87L2.55 -0.58L1.27 1.27ZM7.53 9.8L9.67 11.94C9.45 12.03 9.23 12.09 9 12.09C7.62 12.09 6.5 10.97 6.5 9.59C6.5 9.36 6.56 9.14 6.65 8.92L7.53 9.8Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            </div>
            {validationErrors.password && (
              <span className="error-text">{validationErrors.password}</span>
            )}
          </div>
        </div>

        <div
          className={`loginsignup-agree ${validationErrors.terms ? "error" : ""}`}
        >
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (validationErrors.terms) {
                setValidationErrors({ ...validationErrors, terms: "" });
              }
            }}
            disabled={loading}
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {validationErrors.terms && (
          <span className="error-text terms-error">
            {validationErrors.terms}
          </span>
        )}

        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <span>
                {state === "Login" ? "Logging in..." : "Creating account..."}
              </span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>

        <div className="loginsignup-switch">
          {state === "Sign Up" ? (
            <p className="loginsignup-login">
              Already have an account?{" "}
              <span
                onClick={() => {
                  if (!loading) setState("Login");
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="loginsignup-login">
              Create an account?{" "}
              <span
                onClick={() => {
                  if (!loading) setState("Sign Up");
                }}
              >
                Sign Up here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
