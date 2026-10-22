import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    if (errorMessage) setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await API.post("/api/auth/login", formData);

      // Save token & user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Role based redirect
      if (response.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failure:", error);
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        setErrorMessage(
          "The server took too long to respond. The backend may be spinning up from cold sleep. Please retry in a few seconds."
        );
      } else if (!error.response) {
        setErrorMessage(
          "Unable to connect to the backend server. Please verify your internet connection or backend server status."
        );
      } else {
        setErrorMessage(
          error.response.data?.message || "Invalid credentials. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand__name">AI Interview</div>
          <div className="auth-brand__sub">Preparation</div>
        </div>

        {/* Heading */}
        <h1 className="auth-heading">
          Sign <em>in.</em>
        </h1>
        <p className="auth-hint">Continue where you left off.</p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-alert auth-alert--error" role="alert">
            <svg
              className="auth-alert__icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="16"
              height="16"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email */}
        <div className="auth-field">
          <label className="auth-field__label">Email</label>
          <input
            className="auth-field__input"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-field__label">Password</label>
          <input
            className="auth-field__input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        {/* Forgot password */}
        <div className="auth-forgot-row">
          <Link to="/" className="auth-forgot">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? (
            <span className="auth-btn__content">
              <span className="auth-spinner" /> Signing in...
            </span>
          ) : (
            "Continue →"
          )}
        </button>

        {/* Sign up */}
        <p className="auth-foot">
          No account?{" "}
          <Link to="/signup" className="auth-foot__link">
            Sign up free
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
