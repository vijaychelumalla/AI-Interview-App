import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoute from "./Components/PrivateRoute";
import AdminRoute from "./Components/AdminRoute";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Interview from "./Pages/Interview";
import Result from "./Pages/Result";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;