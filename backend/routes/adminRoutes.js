import { getUsers, deleteUser } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const User = require("../models/User");
const Interview = require("../models/Interview");



router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Get all interviews
router.get("/interviews", protect, adminOnly, async (req, res) => {
  const interviews = await Interview.find().populate("user", "name email");
  res.json(interviews);
});

module.exports = router;