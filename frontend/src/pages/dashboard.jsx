import React from "react";
import { Link } from "react-router-dom";  // <-- ADD THIS
import "./dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const dashboard = () => {
  // Dummy data (replace with DB later)
  const progressData = [
    { day: "Mon", value: 70 },
    { day: "Tue", value: 50 },
    { day: "Wed", value: 75 },
    { day: "Thu", value: 60 },
    { day: "Fri", value: 80 },
    { day: "Sat", value: 65 },
    { day: "Sun", value: 40 },
  ];

  const difficultyData = [
    { name: "Hard", value: 25, color: "#ef4444" },
    { name: "Medium", value: 30, color: "#f59e0b" },
    { name: "Easy", value: 25, color: "#22c55e" },
    { name: "Beginner", value: 20, color: "#3b82f6" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">📊 Project Analyzer</h2>
        <ul className="menu">
          <li className="active">Dashboard</li>
          <li>Projects</li>
          <li>Questions</li>
          <li>Feedback</li>
         
        </ul>
        <div className="profile">
          <div className="avatar">JD</div>
          <div>
            <p className="name">John Doe</p>
            <p className="role">Senior Developer</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <h1>Welcome back, John!</h1>
        <p className="subtitle">
          Here’s what’s happening with your projects today.
        </p>

        {/* Top Stats */}
        <div className="stats">
          <div className="stat-card">
            <h2>24</h2>
            <p>Total Projects</p>
            <span className="positive">↑ 1.2% from last month</span>
          </div>
          <div className="stat-card">
            <h2>156K</h2>
            <p>Analyzed Code</p>
            <span className="positive">↑ 8% from last week</span>
          </div>
          {/* <div className="stat-card">
            <h2>342</h2>
            <p>Questions Answered</p>
            <span className="positive">↑ 5% from yesterday</span>
          </div> */}
          {/* <div className="stat-card">
            <h2>78%</h2>
            <p>Skill Score</p>
            <span className="positive">↑ 3% improvement</span>
          </div> */}
        </div>

        {/* Charts */}
        <div className="charts">
          {/* Bar Chart */}
          <div className="chart-box">
            <h3>Project Analysis Progress (Last 7 days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="chart-box">
            <h3>Question Difficulty Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Type</th>
               
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>E-commerce Platform</td>
                <td>Code Analysis</td>
               
                <td><span className="status completed">Completed</span></td>
              </tr>
              <tr>
                <td>Mobile Banking App</td>
                <td>Question Set</td>
                
                <td><span className="status completed">Completed</span></td>
              </tr>
              <tr>
                <td>Social Media Dashboard</td>
                <td>Code Analysis</td>
                <td><span className="status pending">Pending</span></td>
              </tr>
              <tr>
                <td>Healthcare Management</td>
                <td>Question Set</td>
                
                <td><span className="status pending">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <Link to="/UploadProject" className="action-btn">📂 Upload Project</Link>
          <Link to="/Questions" className="action-btn">📝 Create Questions</Link>
        </div>
      </main>
    </div>
  );
};

export default dashboard;
