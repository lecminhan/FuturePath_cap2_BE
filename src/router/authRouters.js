const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controller/authController");
const authenticateUser = require("../Middleware/auth");
const authorize = require("../Middleware/authorize");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route
router.get(
  "/admin",
  authenticateUser,
  authorize([3]), // Chỉ role admin (id=3)
  (req, res) => {
    res.json({ message: "Admin dashboard" });
  }
);

// Student và Expert có thể truy cập
router.get(
  "/common-area",
  authenticateUser,
  authorize([1, 2]), // STUDENT (1) hoặc EXPERT (2)
  (req, res) => {
    res.json({ message: "Common area" });
  }
);

module.exports = router;
