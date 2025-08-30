import React, { useState } from "react";
import "./Questions.css";

function Questions() {
  const [search, setSearch] = useState("");

  const questions = [
    {
      id: 1,
      difficulty: "Medium",
      category: "React",
      text: "Explain the difference between controlled and uncontrolled components in React forms.",
    },
    {
      id: 2,
      difficulty: "Hard",
      category: "Node.js",
      text: "How would you implement rate limiting middleware in Node.js to prevent API abuse?",
    },
    {
      id: 3,
      difficulty: "Easy",
      category: "MongoDB",
      text: "What are the key differences between SQL and NoSQL databases?",
    },
    {
      id: 4,
      difficulty: "Medium",
      category: "API Design",
      text: "Discuss RESTful API versioning strategies and trade-offs.",
    },
    {
      id: 5,
      difficulty: "Hard",
      category: "Security",
      text: "Explain how you implemented authentication and authorization in your project.",
    },
    {
      id: 6,
      difficulty: "Easy",
      category: "JavaScript",
      text: "What are JavaScript Promises and how do they differ from async/await?",
    },
  ];

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="questions-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Project Analyzer</h2>
        <div className="sidebar-section">
          <h4>Current Project</h4>
          <p><b>Name:</b> E-commerce Platform</p>
          <p><b>Technologies:</b> React, Node.js, MongoDB</p>
          <p><b>Team Size:</b> 8 developers</p>
        </div>

        <div className="sidebar-section">
          <h4>DIFFICULTY LEVEL</h4>
          <div className="tags">
            <span className="tag easy">Easy</span>
            <span className="tag medium">Medium</span>
            <span className="tag hard">Hard</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h4>ROLE</h4>
          <label><input type="checkbox" defaultChecked /> Backend</label><br />
          <label><input type="checkbox" defaultChecked /> Frontend</label><br />
          <label><input type="checkbox" /> ML</label><br />
          <label><input type="checkbox" defaultChecked /> Full-stack</label>
        </div>

        <div className="sidebar-section">
          <h4>TECHNOLOGY CATEGORY</h4>
          <select>
            <option>All Categories</option>
            <option>React</option>
            <option>Node.js</option>
            <option>MongoDB</option>
          </select>
        </div>

        <button className="generate-btn">Generate Questions</button>
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
          <div className="top-buttons">
            <button className="refresh-btn">⟳ Refresh</button>
            <button className="export-btn">⬇ Export</button>
          </div>
        </div>

        <h2 className="page-title">Generated Questions</h2>

        <div className="questions-grid">
          {filteredQuestions.map((q) => (
            <div key={q.id} className={`question-card ${q.difficulty.toLowerCase()}`}>
              <div className="question-tags">
                <span className={`tag ${q.difficulty.toLowerCase()}`}>
                  {q.difficulty}
                </span>
                <span className="tag category">{q.category}</span>
              </div>
              <p>{q.text}</p>
              <div className="card-actions">
                <button>👁 View Answer</button>
                <button>💾 Save</button>
                <button>✔ Mark Complete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
        </div>
      </main>
    </div>
  );
}

export default Questions;
