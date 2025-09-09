const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "user", // you can change to "admin" if needed
  },
  gender: {
    type: String,
    trim: true,
    required: true,
  },
  projectList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // connects to Project model
    },
  ],
});

// Plugin for handling username + password
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("User", userSchema);

module.exports = User;
