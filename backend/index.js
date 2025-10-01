// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const passport=require("passport");
const session = require("express-session");
const User = require("./models/user");
const MongoStore = require("connect-mongo");

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // define storage folder

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));


app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Log every request to /api/projects to see if frontend hits backend
app.use("/api/projects", (req, res, next) => {
  console.log(`Backend hit: ${req.method} ${req.originalUrl}`);
  next();
});


app.use(
  session({
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));


// Root GET route to return all projects from DB
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find({}).populate("author", "username email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File received:", req.file);  // <-- check here
  res.json({ message: "File uploaded successfully!", file: req.file });
});


//  Connect MongoDB & start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" MongoDB Connected");
  })
  .catch((err) => console.error(" MongoDB connection error:", err));




const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
      console.log(` Server running on port ${PORT}`)
);



app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());