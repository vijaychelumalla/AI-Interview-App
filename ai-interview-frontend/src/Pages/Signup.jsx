import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");

    try {
      const response = await API.post("/api/auth/signup", formData);

      setSuccessMessage(
        response.data?.message || "Account created successfully! Redirecting to login..."
      );

      // If response includes token & user, we could either redirect to login or save and go to dashboard.
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        setErrorMessage(
          "The server took too long to respond. The backend may be spinning up from cold sleep. Please retry in a few seconds."
        );
      } else if (!error.response) {
        setErrorMessage(
          "Unable to connect to the backend server. Please verify your internet connection or backend server status."
        );
      } else if (error.response.status === 502 || error.response.status === 504) {
        setErrorMessage(
          "Backend gateway error (" + error.response.status + "). The backend server is unreachable. Please verify deployment status."
        );
      } else if (error.response.status === 503) {
        setErrorMessage(
          error.response.data?.message || "Database service is temporarily unavailable. Please verify MongoDB connection."
        );
      } else {
        const msg = error.response.data?.message;
        setErrorMessage(
          typeof msg === "string" ? msg : "Registration failed. Please check your details."
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
          Create <em>account.</em>
        </h1>
        <p className="auth-hint">Start your interview prep journey today.</p>

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

        {/* Success Alert */}
        {successMessage && (
          <div className="auth-alert auth-alert--success" role="status">
            <svg
              className="auth-alert__icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="16"
              height="16"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Name */}
        <div className="auth-field">
          <label className="auth-field__label">Full Name</label>
          <input
            className="auth-field__input"
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
            disabled={loading}
          />
        </div>

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
        <div className="auth-field" style={{ marginBottom: "20px" }}>
          <label className="auth-field__label">Password</label>
          <input
            className="auth-field__input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
            required
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? (
            <span className="auth-btn__content">
              <span className="auth-spinner" /> Creating account...
            </span>
          ) : (
            "Sign up free →"
          )}
        </button>

        {/* Login link */}
        <p className="auth-foot">
          Already have an account?{" "}
          <Link to="/login" className="auth-foot__link">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
