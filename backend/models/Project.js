const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🌐 Type of source: ZIP upload or GitHub repo
    sourceType: {
      type: String,
      enum: ["github", "zip"],
      required: true,
    },

    // 📁 ZIP related fields
    zipFilePath: {
      type: String,
      trim: true,
    },
    projectPath: {
      type: String, // extracted folder path sent to ML
      trim: true,
    },
    fileSize: {
      type: Number, // zip file size in bytes
    },

    // 🔗 GitHub related fields
    githubLink: {
      type: String,
      trim: true,
    },

    // ✔ ML Output: Tech stack prediction
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],

    // ✔ Additional analysis metadata
    analysisStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    analysisLogs: [
      {
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ❓ ML generated questions
    questions: [
      {
        question: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // 🌍 Optional deployed site
    deployedLink: {
      type: String,
      trim: true,
    },

    // 📊 Language statistics (optional)
    languageStats: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
