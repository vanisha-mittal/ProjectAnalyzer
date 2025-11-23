
const express = require("express");
const User = require("../models/userSchema");
const passport = require("passport");
const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    let { name, password, email, role, gender } = req.body;
    let user = new User({ name, email, gender, role });
    let newUser = await User.register(user, password);

    res.status(201).json({ message: "Account created successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post(
  "/login",
  passport.authenticate("local", { failureMessage: true }),
  (req, res) => {
    res.json({ message: `Welcome back ${req.user.name}`, user: req.user });
  }
);

// Logout user
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
