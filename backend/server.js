require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();   // ✅ Create app FIRST

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const protect = require("./middleware/authMiddleware");
const adminRoutes = require("./routes/admin");


app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// Health & status check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Interview API is operational",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1,
  });
});

const path = require("path");

// Serve frontend build static assets
const frontendBuildPath = path.join(__dirname, "../ai-interview-frontend/build");
app.use(express.static(frontendBuildPath));

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.user });
});

// Serve frontend SPA fallback for all non-API web routes
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(frontendBuildPath, "index.html"));
  }
  next();
});

const PORT = process.env.PORT || 5000;

let reconnectTimer = null;
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aiInterviewDB";
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB Connected successfully");
    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }
  } catch (err) {
    console.warn(`Primary MongoDB connection failed (${err.message}). Falling back to local MongoDB...`);
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/aiInterviewDB", { serverSelectionTimeoutMS: 3000 });
      console.log("Local MongoDB Connected successfully");
      if (reconnectTimer) {
        clearInterval(reconnectTimer);
        reconnectTimer = null;
      }
    } catch (localErr) {
      console.error("Local MongoDB connection also failed:", localErr.message);
      console.warn("Server will continue running. Ensure MONGO_URI is set to a live MongoDB Atlas cluster for full functionality.");
      if (process.env.NODE_ENV !== "test" && !reconnectTimer) {
        reconnectTimer = setInterval(connectDB, 15000);
      }
    }
  }
};

if (process.env.NODE_ENV !== "test") {
  // Always bind and listen on PORT immediately so cloud health checks pass
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  connectDB();
}

module.exports = app;
