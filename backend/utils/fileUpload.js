// utils/fileUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// === Multer config for ZIP uploads ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");

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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

function validateGithubLink(link) {
  const githubRegex =
    /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/)?$/;
  return githubRegex.test(link);
}

module.exports = { upload, validateGithubLink };
