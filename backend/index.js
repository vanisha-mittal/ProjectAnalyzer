  // index.js
  const express = require("express");
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const path = require("path");
  const cors = require("cors");
  const session = require("express-session");
  const passport = require("passport");

  dotenv.config();

  const app = express();

  // Middlewares
  // for connecting frontend

  app.use(cors({
    origin: "http://localhost:3000", // React dev server
    credentials: true
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //  Serve uploaded files
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.use("/public", express.static(path.join(__dirname, "public")));

  // --- SESSION & PASSPORT SETUP --- //
  app.use(session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,      // false for HTTP (localhost)
      httpOnly: false,    // allow frontend access
      sameSite: "lax"     // important for cross-origin requests
    }
  }));


  app.use(passport.initialize());
  app.use(passport.session());

  // Passport config
  const User = require("./models/User");
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  //  Routes
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/users", require("./routes/userRoutes"));
  app.use("/api/projects", require("./routes/projectRoutes"));

  //  Connect MongoDB & start server
  console.log("MONGO_URI:", process.env.MONGO_URI);

  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));


  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () =>
        console.log(` Server running on port ${PORT}`)
  );