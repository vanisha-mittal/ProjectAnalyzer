const express = require("express");
const Project = require("../models/Project");
const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const { runTechDetector } = require("../utils/runPython");
const router = express.Router();

// ==================== Analyze project from GitHub URL ====================
router.post("/upload/github", async (req, res) => {
  try {
    const { githubLink, projectName, author } = req.body;

    if (!githubLink || !projectName || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // --- Create temp folder for cloning ---
    const tmpDir = path.join(__dirname, "../uploads/temp", Date.now().toString());
    fs.mkdirSync(tmpDir, { recursive: true });

    console.log("🔗 Cloning repo:", githubLink);

    const git = simpleGit();
    await git.clone(githubLink, tmpDir);

    console.log("✅ Repo cloned successfully");

    // --- Run Python tech detector ---
    const mlResult = await runTechDetector(tmpDir);
    console.log("🧠 Tech Stack detected:", mlResult);

    // --- Save in MongoDB ---
    const newProject = new Project({
      projectName,
      author,
      sourceType: "github",
      githubLink,
      techStack: mlResult.languages.concat(mlResult.frameworks, mlResult.tools),
    });

    await newProject.save();

    // --- Cleanup ---
    fs.rmSync(tmpDir, { recursive: true, force: true });

    res.status(201).json({
      message: "GitHub project analyzed successfully",
      project: newProject,
    });
  } catch (err) {
    console.error("❌ Error analyzing GitHub repo:", err);
    res.status(500).json({ error: err.message });
  }
});


// ==================== CREATE project via ZIP upload ====================
router.post("/upload/zip", upload.single("projectZip"), async (req, res) => {
  try {
    const { projectName, author } = req.body;

    if (!projectName || !author) {
      return res.status(400).json({ error: "Project name and author are required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No ZIP file uploaded" });
    }

    console.log("📦 Received ZIP file:", req.file.path);

    // --- Run Python tech detector ---
    const mlResult = await runTechDetector(req.file.path);
    console.log("🧠 ML Detection Result:", mlResult);

    const newProject = new Project({
      projectName,
      author,
      sourceType: "zip",
      zipFilePath: req.file.path,
      techStack: mlResult.languages.concat(mlResult.frameworks, mlResult.tools),
    });

    await newProject.save();

    res.status(201).json({
      message: "Project uploaded & tech stack detected successfully",
      project: newProject,
    });
  } catch (err) {
    console.error("❌ Error in /upload/zip:", err);
    res.status(500).json({ error: err.message });
  }
});




// ==================== GET all projects ====================
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}).populate("author", "username email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==================== GET project by ID ====================
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("author", "username email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CREATE project via GitHub link ====================
router.post("/upload/github", async (req, res) => {
  try {
    const { projectName, githubLink, author } = req.body;

    if (!projectName || !githubLink || !author) {
      return res.status(400).json({ error: "Project name, GitHub link, and author are required" });
    }

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

// ==================== CREATE project via ZIP file upload ====================
router.post("/upload/zip", upload.single("projectZip"), async (req, res) => {
  try {
    const { projectName, author } = req.body;

    if (!projectName || !author) {
      return res.status(400).json({ error: "Project name and author are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 1: Run ML detector on the uploaded zip
    const mlResult = await runTechDetector(req.file.path);

    if (mlResult.error) {
      return res.status(500).json({ error: mlResult.error });
    }

    // Step 2: Save project with tech stack
    const newProject = new Project({
      projectName,
      author,
      zipFilePath: req.file.path,
      sourceType: "zip",
      techStack: mlResult.tech_stack || [],
      questions: mlResult.questions || [], // later you can add questions generation in Python
    });

    await newProject.save();

    res.status(201).json({
      message: "Project uploaded and processed successfully",
      project: newProject,
    });
  } catch (err) {
    console.error("Error in /upload/zip:", err);
    res.status(400).json({ error: err.message });
  }
});

// ==================== UPDATE project ====================
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

// ==================== DELETE project ====================
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







// // routes/projectRoutes.js
// const express = require("express");
// const Project = require("../models/Project");
// const { upload, validateGithubLink } = require("../utils/fileUpload"); //correct path as per your setup
// const router = express.Router();

// // GET all projects
// router.get("/", async (req, res) => {
//   try {
//     const projects = await Project.find({}).populate("author", "username email");
//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET project by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id).populate("author", "username email");
//     if (!project) return res.status(404).json({ message: "Project not found" });
//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // CREATE project via GitHub link
// router.post("/upload/github", async (req, res) => {
//   try {
//     const { projectName, githubLink, author } = req.body;

//     if (!projectName || !githubLink || !author) {
//       return res.status(400).json({ error: "Project name, GitHub link, and author are required" });
//     }

//     if (!validateGithubLink(githubLink)) {
//       return res.status(400).json({ error: "Invalid GitHub link" });
//     }

//     const newProject = new Project({
//       projectName,
//       author,
//       githubLink,
//       sourceType: "github",
//     });

//     await newProject.save();
//     res.status(201).json(newProject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // CREATE project via ZIP file upload
// router.post("/upload/zip", upload.single("projectZip"), async (req, res) => {
//   try {
//     const { projectName, author } = req.body;

//     if (!projectName || !author) {
//       return res.status(400).json({ error: "Project name and author are required" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const newProject = new Project({
//       projectName,
//       author,
//       zipFilePath: req.file.path,
//       sourceType: "zip",
//     });

//     await newProject.save();
//     res.status(201).json(newProject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // UPDATE project (ML model fills in tech stack & questions)
// router.put("/:id", async (req, res) => {
//   try {
//     const { techStack, questions } = req.body;

//     const updatedProject = await Project.findByIdAndUpdate(
//       req.params.id,
//       { techStack, questions },
//       { new: true, runValidators: true }
//     );

//     if (!updatedProject) return res.status(404).json({ message: "Project not found" });

//     res.json(updatedProject);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // DELETE project
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedProject = await Project.findByIdAndDelete(req.params.id);
//     if (!deletedProject) return res.status(404).json({ message: "Project not found" });

//     res.json({ message: "Project deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
