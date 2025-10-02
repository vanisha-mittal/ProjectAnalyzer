// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/public", express.static(path.join(__dirname, "public")));
// for connecting frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


//  Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));

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