import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";


import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend,} from "recharts";
const dashboard = () => {
  // Dummy data (replace with DB later)
  const progressData = [
    { day: "1", value: 70 },
    { day: "2", value: 50 },
    { day: "3", value: 75 },
    { day: "4", value: 60 }];
  

  const difficultyData = [
    { name: "Hard", value: 25, color: "#6366f1" },
    { name: "Medium", value: 30, color: "#3b82f6" },
    { name: "Easy", value: 25, color: "#22c55e" },
    { name: "Beginner", value: 20, color: "#f59e0b" },
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

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <h2>24</h2>
            <p>Total Projects</p>
            <span className="positive">↑ 1.2% from last month</span>
          </div>
          <div className="stat-card">
            <h2>156</h2>
            <p>Analyzed Code</p>
            <span className="positive">↑ 8% from last week</span>
          </div>

          <div className="stat-card">
            <h2>10</h2>
            <p>Skills Analyzed</p>
            <span className="positive">↑ 3% improvement</span>
          </div>
        </div>

        {/* Charts */}
        <div className="charts">
          {/* Bar Chart */}
          <div className="chart-box">

            <div className="flex justify-between items-center mb-2">
              <h5>Project Analysis Progress</h5>
              <span style={{fontWeight: 'lighter', color: '#aaa'}}>Last 4 days</span>
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
      color: "#f1f5f9"
    }}
  />
  <Bar dataKey="value" fill="#1d89e4" radius={[6, 6, 0, 0]} activeBar={false} />
</BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie (Donut) Chart */}
          <div className="chart-box">
            <div className="flex justify-between items-center mb-2">
              <h5>Question Difficulty Distribution</h5>
              <span style={{fontWeight: 'lighter', color: '#aaa'}}>All time</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  labelLine={false}
                >
                  {difficultyData.map((entry, index) => (
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
                <Tooltip/>
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
                <td><span className="status-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Mobile Banking App</td>
                <td>Question Set</td>
                <td><span className="status-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Social Media Dashboard</td>
                <td>Code Analysis</td>
                <td><span className="status-pending">Pending</span></td>
              </tr>
              <tr>
                <td>Healthcare Management</td>
                <td>Question Set</td>
                <td><span className="status-pending">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <Link to="/UploadProject" className="action-btn"><i className="fa-solid fa-cloud-arrow-up" style={{fontSize: '1rem', marginRight: '0.5rem'}}></i> Upload Project</Link>
          <Link to="/Questions" className="action-btn"><i className="fa-regular fa-circle-question" style={{ marginRight: '0.5rem'}}></i>  Create Questions</Link>
        </div>
      </main>
    </div>
  );
};

export default dashboard;
