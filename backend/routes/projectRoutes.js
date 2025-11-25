// backend/routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const axios = require("axios");
const Project = require("../models/Project");
// const User= require("../models/User");

// === MULTER SETUP ===
const upload = multer({ dest: "uploads/" });

// ===================== ZIP UPLOAD + ML ANALYSIS =====================
router.post("/upload/zip", upload.single("projectZip"), async (req, res) => {
  try {
    const uploadedZip = req.file;

    if (!uploadedZip)
      return res.status(400).json({ error: "No ZIP file uploaded" });

    const { projectName } = req.body;

    if (!req.user)
      return res.status(401).json({ error: "User not logged in" });

    const author = req.user._id;

    if (!projectName)
      return res.status(400).json({ error: "Project name required" });

    console.log("📦 ZIP received:", uploadedZip.path);

    // 1. Extract ZIP
    const extractTo = path.join(
      __dirname,
      "..",
      "uploads",
      `${Date.now()}_${projectName}`
    );

    fs.mkdirSync(extractTo, { recursive: true });

    const zip = new AdmZip(uploadedZip.path);
    zip.extractAllTo(extractTo, true);

    fs.unlinkSync(uploadedZip.path);
    console.log("🗂 ZIP extracted to:", extractTo);

    // 2. Create project FIRST
    const newProject = await Project.create({
      projectName,
      author,
      sourceType: "zip",
      zipFilePath: extractTo,
      projectPath: extractTo,
      techStack: [],
      analysisStatus: "pending"
    });

    // 3. Add project to user
    const User = require("../models/userSchema");
    await User.findByIdAndUpdate(
      author,
      { $push: { projectList: newProject._id } },
      { new: true }
    );

    // 4. Call FLASK using newProject._id
    console.log("📡 Sending to ML with projectId:", newProject._id);

    const flaskResult = await axios.post("http://localhost:5000/predict/path", {
      projectId: newProject._id,
      projectPath: extractTo
    });

    const techstack = flaskResult.data.techstack;
    console.log("🧠 ML Tech Stack:", techstack);

    // 🔥 PRINT GENERATED QUESTION IN CONSOLE
    console.log("\n================ ML QUESTION ================");
    console.log("🧪 Tech Stack:", flaskResult.data.techstack);
    console.log("❓ Question:", flaskResult.data.question);
    console.log("📘 Difficulty:", flaskResult.data.difficulty);
    console.log("============================================\n");

    // 5. Update project tech stack
    await Project.findByIdAndUpdate(
  newProject._id,
  {
    techStack: techstack,
    $push: {
      questions: {
        question: flaskResult.data.question,
        tech: techstack,
        difficulty: flaskResult.data.difficulty,
        createdAt: new Date()
      }
    }
  },
  { new: true }
);


    return res.status(201).json({
      message: "ZIP uploaded, extracted, and ML analysis completed",
      project: newProject,
      techstack,
      question: flaskResult.data.question,
      difficulty: flaskResult.data.difficulty
    });


  } catch (err) {
    console.error("❌ ZIP Upload Error:", err);
    return res.status(500).json({ error: "ZIP upload or ML failed" });
  }
});


// ===================== GET ALL PROJECTS =====================
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("author", "username email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===================== GET PROJECT BY ID =====================
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "author",
      "username email"
    );

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===================== UPDATE PROJECT (OPTIONAL) =====================
router.put("/:id", async (req, res) => {
  try {
    const { techStack, questions } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { techStack, questions },
      { new: true, runValidators: true }
    );

    if (!updatedProject)
      return res.status(404).json({ error: "Project not found" });

    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ===================== DELETE PROJECT =====================
router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject)
      return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
