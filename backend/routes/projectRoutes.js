// routes/projectRoutes.js
const express = require("express");
const Project = require("../models/Project");
const {  upload, validateGithubLink } = require("../utils/fileUpload");
const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}).populate("author", "username email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("author", "username email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  CREATE project via GitHub link
router.post("/upload/github", async (req, res) => {
  try {
    const { projectName, githubLink, author } = req.body;

    if (!validateGithubLink(githubLink)) {
      return res.status(400).json({ error: "Invalid GitHub link" });
    }

    const newProject = new Project({
      projectName,
      author,
      githubLink,
      sourceType: "github",
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  CREATE project via ZIP file upload
router.post("/upload/zip", upload.single("projectZip"), async (req, res) => {
  try {
    const { projectName, author } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newProject = new Project({
      projectName,
      author,
      zipFilePath: req.file.path,
      sourceType: "zip",
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  UPDATE project (e.g., ML model fills in tech stack & questions)
router.put("/:id", async (req, res) => {
  try {
    const { techStack, questions } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { techStack, questions },
      { new: true, runValidators: true }
    );

    if (!updatedProject) return res.status(404).json({ message: "Project not found" });

    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//  DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
