// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Auth.css";
// import axios from "axios";

// function Signup() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/signup",
//         formData
//       );

//       alert(response.data.message);
//       navigate("/login");

//     } catch (error) {
//       alert(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Signup</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Enter Name"
//           onChange={handleChange}
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Enter Email"
//           onChange={handleChange}
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Enter Password"
//           onChange={handleChange}
//         />

//         <button type="submit">Signup</button>

//         <p>
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Signup;



import  { useState } from "react";
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
        "/api/auth/signup",
        formData
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
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
            required
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
            required
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
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" className="auth-btn">
          Sign up free →
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























// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Auth.css";
// import axios from "axios";

// function Signup() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/signup",
//         formData
//       );

//       alert(response.data.message);
//       navigate("/login");

//     } catch (error) {
//       alert(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Signup</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Enter Name"
//           onChange={handleChange}
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Enter Email"
//           onChange={handleChange}
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Enter Password"
//           onChange={handleChange}
//         />

//         <button type="submit">Signup</button>

//         <p>
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Signup;
