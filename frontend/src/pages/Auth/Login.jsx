import React, { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      }, { withCredentials: true });  //  important if you use sessions/cookies

      console.log("Login success:", res.data);
      alert("Login successful!");
      // Redirect to projects page
      window.location.href = "/projects";

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          <i className="fa-solid fa-chart-column"></i><br />
          Project Analyzer
        </h2>

        <div className="auth-tabs">
          <Link to="/login" className="auth-tab" id="target">Login</Link>
          <Link to="/signup" className="auth-tab">Register</Link>
        </div>

        <h5 style={{ textAlign: "center", marginBottom: "1rem" }}>Welcome Back</h5>

        <form onSubmit={handleSubmit}>
          <label>Email / Username</label>
          <input
            type="text"
            placeholder="Enter your email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="auth-extra">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
        </form>

        <div className="divider">OR</div>

        <div className="social-login">
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-google"></i>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>

        <div className="auth-footer">
          Don’t have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
