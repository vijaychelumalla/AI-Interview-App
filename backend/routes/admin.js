const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Interview = require("../models/Interview");


const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const bcrypt = require("bcryptjs");


// ─────────────────────────────────────────
// CREATE DEFAULT ADMIN
// ─────────────────────────────────────────
router.post("/create-admin", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    res.json({ message: "Admin created successfully" });

  } catch (err) {
    res.status(500).json(err);
  }
});


// ─────────────────────────────────────────
// ADMIN TEST ROUTE
// ─────────────────────────────────────────
router.get("/", (req, res) => {
  res.send("Admin login successful");
});


// ─────────────────────────────────────────
// GET ALL USERS
// ─────────────────────────────────────────
router.get("/users", protect, adminOnly, async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ─────────────────────────────────────────
// DELETE USER
// ─────────────────────────────────────────
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


// ─────────────────────────────────────────
// ADMIN DASHBOARD STATS
// ─────────────────────────────────────────
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    

    res.json({
      users: totalUsers,
      interviews: totalInterviews,
    
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get("/interviews", async (req, res) => {
  try {

    const interviews = await Interview.find()
      .populate("createdBy", "name")
      .populate("questions");

    res.json(interviews);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;











// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

// const protect = require("../middleware/authMiddleware");
// const adminOnly = require("../middleware/adminMiddleware");
// const bcrypt = require("bcryptjs");


// router.post("/create-admin", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash("123456", 10);

//     const admin = new User({
//       name: "Admin",
//       email: "admin@gmail.com",
//       password: hashedPassword,
//       role: "admin"
//     });

//     await admin.save();
//     res.json({ message: "Admin created successfully" });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// router.get("/", (req, res) => {
//   res.send("Admin login successful");
// });
// // ✅ GET ALL USERS
// router.get("/users", protect, adminOnly, async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ DELETE USER
// router.delete("/users/:id", protect, adminOnly, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });

// module.exports = router;    













// last version of admin.js before refactor to add interview stats and other admin features
// const express = require("express");
// const router = express.Router();

// const User = require("../models/User");
// const Interview = require("../models/Interview");


// const protect = require("../middleware/authMiddleware");
// const adminOnly = require("../middleware/adminMiddleware");

// const bcrypt = require("bcryptjs");


// // ─────────────────────────────────────────
// // CREATE DEFAULT ADMIN
// // ─────────────────────────────────────────
// router.post("/create-admin", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash("123456", 10);

//     const admin = new User({
//       name: "Admin",
//       email: "admin@gmail.com",
//       password: hashedPassword,
//       role: "admin"
//     });

//     await admin.save();

//     res.json({ message: "Admin created successfully" });

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


// // ─────────────────────────────────────────
// // ADMIN TEST ROUTE
// // ─────────────────────────────────────────
// router.get("/", (req, res) => {
//   res.send("Admin login successful");
// });


// // ─────────────────────────────────────────
// // GET ALL USERS
// // ─────────────────────────────────────────
// router.get("/users", protect, adminOnly, async (req, res) => {
//   try {

//     const users = await User.find().select("-password");

//     res.json(users);

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // ─────────────────────────────────────────
// // DELETE USER
// // ─────────────────────────────────────────
// router.delete("/users/:id", protect, adminOnly, async (req, res) => {
//   try {

//     await User.findByIdAndDelete(req.params.id);

//     res.json({ message: "User deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });


// // ─────────────────────────────────────────
// // ADMIN DASHBOARD STATS
// // ─────────────────────────────────────────
// router.get("/stats", protect, adminOnly, async (req, res) => {
//   try {

//     const totalUsers = await User.countDocuments();
//     const totalInterviews = await Interview.countDocuments();
    

//     res.json({
//       users: totalUsers,
//       interviews: totalInterviews,
    
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch stats" });
//   }
// });


// module.exports = router;


