const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Interview = require("../models/Interview");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ─────────────────────────────────────────
// CREATE DEFAULT ADMIN (Protected by Secret / Dev-only)
// ─────────────────────────────────────────
router.post("/create-admin", async (req, res) => {
  try {
    const adminSecret = req.headers["x-admin-secret"] || req.body?.adminSecret;
    const configuredSecret = process.env.ADMIN_SECRET_KEY;

    // Disallow in production unless configured secret matches
    if (process.env.NODE_ENV === "production") {
      if (!configuredSecret || adminSecret !== configuredSecret) {
        return res.status(403).json({
          message: "Forbidden: Admin creation requires a valid ADMIN_SECRET_KEY in production"
        });
      }
    } else if (configuredSecret && adminSecret !== configuredSecret) {
      return res.status(403).json({
        message: "Forbidden: Invalid admin setup secret key"
      });
    }

    const email = (req.body?.email || "admin@gmail.com").toLowerCase().trim();
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: `Admin account with email ${email} already exists` });
    }

    const passwordToHash = req.body?.password || "123456";
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const admin = new User({
      name: req.body?.name || "Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({ message: "Server error creating admin" });
  }
});

// ─────────────────────────────────────────
// ADMIN TEST ROUTE
// ─────────────────────────────────────────
router.get("/", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin area access authorized", user: req.user });
});

// ─────────────────────────────────────────
// GET ALL USERS (Admin Only)
// ─────────────────────────────────────────
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error fetching users" });
  }
});

// ─────────────────────────────────────────
// DELETE USER (Admin Only)
// ─────────────────────────────────────────
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Security violation: Cannot delete your own admin account" });
    }

    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Delete failed" });
  }
});

// ─────────────────────────────────────────
// ADMIN DASHBOARD STATS (Admin Only)
// ─────────────────────────────────────────
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();

    return res.json({
      users: totalUsers,
      interviews: totalInterviews
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ─────────────────────────────────────────
// GET ALL INTERVIEWS (Admin Only & Correct Populate)
// ─────────────────────────────────────────
router.get("/interviews", protect, adminOnly, async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.json(interviews);
  } catch (err) {
    console.error("Fetch interviews error:", err);
    return res.status(500).json({ message: "Server Error fetching interviews" });
  }
});

module.exports = router;
