



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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/api/auth/login",
        formData
      );

      // Save token & user
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful!");

      // Role based redirect
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
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
            required
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
            required
          />
        </div>

        {/* Forgot password */}
        <div className="auth-forgot-row">
          <a href="/" className="auth-forgot">Forgot password?</a>
        </div>

        {/* Submit */}
        <button type="submit" className="auth-btn">
          Continue →
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



















// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Auth.css";

// function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await axios.post(
//       "http://localhost:5000/api/auth/login",
//       formData
//     );

//     // ✅ Save token
//     localStorage.setItem("token", response.data.token);

//     // ✅ Save user (optional but useful)
//     localStorage.setItem("user", JSON.stringify(response.data.user));

//     alert("Login Successful!");

//     // ✅ ROLE BASED REDIRECT
//     if (response.data.user.role === "admin") {
//       navigate("/admin");
//     } else {
//       navigate("/dashboard");
//     }

//   } catch (error) {
//     alert(error.response?.data?.message || "Login failed");
//   }
// };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Enter Email"
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Enter Password"
//           onChange={handleChange}
//           required
//         />

//         <button type="submit">Login</button>

//         <p>
//           Don't have an account? <Link to="/signup">Signup</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Login;
