// routes/userRoutes.js
const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Users route working ");
});

//  Get a specific user profile with their projects
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("projectList");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Update user profile (except password → handled by auth)
router.put("/:id", async (req, res) => {
  try {
    const { email, gender, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, gender, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  Delete user (admin or self)
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
