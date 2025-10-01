// const express = require("express");
// const User = require("../models/User");
// const passport = require("passport");
// const router = express.Router();


// // Register form
// router.get("/register", (req, res) => {
//   res.render("auth/signup");
// });

// // Register user
// router.post("/register", async (req, res) => {
//   try {
//     let { name, password, email, role, gender } = req.body;
//     let user = new User({ name, email, gender, role });
//     let newUser = await User.register(user, password);

//     res.status(201).json({ message: "Account created successfully", user: newUser });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Login form
// router.get("/login", (req, res) => {
//   res.render("auth/login");
// });

// // Login user
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureMessage: true,
//   }),
//   function (req, res) {
//     req.flash("success", `Welcome Back ${req.user.name}`);
//     res.redirect("/projects");
//   }
// );

// // Logout user
// router.get("/logout", (req, res) => {
//   req.logout(() => {
//     req.flash("success", "Logged out successfully");
//     res.redirect("/login");
//   });
// });

// module.exports = router;

const express = require("express");
const User = require("../models/user");
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
