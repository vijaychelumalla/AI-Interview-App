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

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.user });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection failed:", err);
  });
