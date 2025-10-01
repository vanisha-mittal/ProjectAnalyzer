// index.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");

const User = require("./models/user");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" }); // define storage folder

// ===================== MIDDLEWARES ===================== //
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Log requests to /api/projects
app.use("/api/projects", (req, res, next) => {
  console.log(`Backend hit: ${req.method} ${req.originalUrl}`);
  next();
});

// ===================== SESSION & PASSPORT ===================== //
app.use(
  session({
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===================== ROUTES ===================== //
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Root GET route to return all projects from DB
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find({}).populate("author", "username email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File received:", req.file);
  res.json({ message: "File uploaded successfully!", file: req.file });
});

// ===================== DATABASE CONNECTION ===================== //
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===================== START SERVER ===================== //
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
