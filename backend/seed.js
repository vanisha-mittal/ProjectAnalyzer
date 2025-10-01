const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Project = require("./models/Project");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_uri_here";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" MongoDB Connected for Seeding"))
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    // Optional: clear old projects
    await Project.deleteMany({});

    // Users from your DB
    const neha = await User.findById("68d96faf8670d58e8553a957");
    const yati = await User.findById("68d95b45da16c971bede6c59");
    const ravi = await User.findById("68d95bd1da16c971bede6c62");
    const saurav = await User.findById("68d970af84deb726086c50a4");

    // Create hard-coded projects
    const project1 = new Project({
      projectName: "AI Chatbot",
      author: neha._id,
      techStack: ["Python", "Flask", "TensorFlow"],
      questions: [
        { question: "What ML framework is used in this chatbot?" },
        { question: "How is Flask used in this project?" },
      ],
      sourceType: "zip",
    });

    const project2 = new Project({
      projectName: "E-commerce Website",
      author: yati._id,
      techStack: ["Node.js", "Express", "MongoDB", "React"],
      questions: [
        { question: "Which database is used in this project?" },
        { question: "What frontend framework is used?" },
      ],
      sourceType: "github",
      githubLink: "https://github.com/example/ecommerce",
    });

    const project3 = new Project({
      projectName: "Portfolio Website",
      author: ravi._id,
      techStack: ["HTML", "CSS", "JavaScript"],
      questions: [
        { question: "Which technologies are used for frontend?" },
        { question: "How is the portfolio structured?" },
      ],
      sourceType: "zip",
    });

    const project4 = new Project({
      projectName: "Music Recommendation System",
      author: saurav._id,
      techStack: ["Python", "Pandas", "Scikit-learn"],
      questions: [
        { question: "Which ML library is used for recommendations?" },
        { question: "How is Pandas used in this project?" },
      ],
      sourceType: "github",
      githubLink: "https://github.com/example/music-recommender",
    });

    // Save projects
    await project1.save();
    await project2.save();
    await project3.save();
    await project4.save();

    // Update users' projectList
    neha.projectList.push(project1._id);
    yati.projectList.push(project2._id);
    ravi.projectList.push(project3._id);
    saurav.projectList.push(project4._id);

    await neha.save();
    await yati.save();
    await ravi.save();
    await saurav.save();

 process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
