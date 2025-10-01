import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Questions.css";

function Questions() {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const fetchProjectAndQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        // Fetch user info to get project list
        const res = await axios.get(`http://localhost:8080/api/users/${user._id}`, {
          withCredentials: true,
        });

        const projects = res.data.projectList || [];
        if (projects.length === 0) return;

        const project = projects[0]; // currently picking first project
        setCurrentProject(project);

        // Questions are inside project.questions
        setQuestions(project.questions || []);
      } catch (err) {
        console.error("Error fetching project questions:", err);
      }
    };

    fetchProjectAndQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="questions-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Project Analyzer</h2>
        {currentProject && (
          <div className="sidebar-section">
            <h4>Current Project</h4>
            <p><b>Name:</b> {currentProject.projectName}</p>
            <p><b>Tech Stack:</b> {currentProject.techStack?.join(", ") || "-"}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <h2 className="page-title">Project Questions</h2>

        <div className="questions-grid">
          {filteredQuestions.length === 0 ? (
            <p>No questions found.</p>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q._id} className="question-card">
                <p>{q.question}</p>
                <small>Created At: {new Date(q.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Questions;
