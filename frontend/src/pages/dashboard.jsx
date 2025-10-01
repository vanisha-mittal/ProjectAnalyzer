import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?._id;
        if (!userId) return console.warn("No user logged in");

        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          withCredentials: true,
        });

        setUser(res.data);
        setProjects(res.data.projectList || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <p>Loading user info...</p>;

  // Prepare chart data based on available project info
  const progressData = projects.map((p, i) => ({
    day: (i + 1).toString(),
    value: p.questions?.length || 0,
  }));

  const sourceData = [
    {
      name: "GitHub",
      value: projects.filter((p) => p.sourceType === "github").length,
      color: "#6366f1",
    },
    {
      name: "ZIP",
      value: projects.filter((p) => p.sourceType === "zip").length,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">
          <i className="fa-solid fa-laptop-code"></i> Project Analyzer
        </h2>
        <ul className="menu">
          <li className="active"><i className="fa-solid fa-chart-pie"></i> Dashboard</li>
          <li><i className="fa-regular fa-folder"></i> Projects</li>
          <li><i className="fa-regular fa-circle-question"></i> Questions</li>
          <li><i className="fa-regular fa-message"></i> Feedback</li>
        </ul>
        <div className="profile">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div>
            <p className="name">{user.name}</p>
            <p className="role">{user.role || "User"}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <h1>Welcome back, {user.name}!</h1>
        <p className="subtitle">Here’s what’s happening with your projects today.</p>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <h2>{projects.length}</h2>
            <p>Total Projects</p>
          </div>
          <div className="stat-card">
            <h2>{projects.reduce((acc, p) => acc + (p.questions?.length || 0), 0)}</h2>
            <p>Total Questions</p>
          </div>
          <div className="stat-card">
            <h2>{projects.filter((p) => p.deployedLink).length}</h2>
            <p>Deployed Projects</p>
          </div>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="chart-box">
            <div className="flex justify-between items-center mb-2">
              <h5>Questions per Project</h5>
              <span style={{ fontWeight: 'lighter', color: '#aaa' }}>Last {projects.length} projects</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Bar dataKey="value" fill="#1d89e4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <div className="flex justify-between items-center mb-2">
              <h5>Projects by Source Type</h5>
              <span style={{ fontWeight: 'lighter', color: '#aaa' }}>All time</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  labelLine={false}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  formatter={(value) => <span style={{ color: "#f1f5f9" }}>{value}</span>}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Projects</h3>
          {projects.length === 0 ? (
            <p>No projects uploaded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td>{p.projectName}</td>
                    <td>{p.sourceType === "github" ? "GitHub Upload" : "ZIP Upload"}</td>
                    <td>
                      <span className={p.deployedLink ? "status-completed" : "status-pending"}>
                        {p.deployedLink ? "Deployed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <Link to="/New" className="action-btn">
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1rem', marginRight: '0.5rem' }}></i>
            Upload Project
          </Link>
          <Link to="/Questions" className="action-btn">
            <i className="fa-regular fa-circle-question" style={{ marginRight: '0.5rem' }}></i>
            Create Questions
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
