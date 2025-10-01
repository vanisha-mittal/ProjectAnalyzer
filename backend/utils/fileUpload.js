// utils/uploadFiles.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage engine for ZIP uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");

    // Create uploads folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter (only allow ZIP files)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/zip" ||
    file.originalname.toLowerCase().endsWith(".zip")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .zip files are allowed!"), false);
  }
};

// Multer upload middleware (max size 50MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// GitHub Link Validator
function validateGithubLink(link) {
  const githubRegex =
    /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/)?$/;
  return githubRegex.test(link);
}

module.exports = { upload, validateGithubLink };
