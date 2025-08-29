import React, { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup with:", name, email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo / Project Name */}
        <h2><i class="fa-solid fa-chart-column"></i><br />Project Analyzer</h2>

        {/* Tabs */}
        {/* <div className="auth-tabs">
          <button className="tab">Login</button>
          <button className="tab active">Register</button>
        </div> */}

        <div className="auth-tabs">
            <Link to="/login" className="auth-tab" >Login</Link>
            <Link to="/signup" className="auth-tab" id="target">Register</Link>
          </div>


        <h5 style={{ textAlign: "center", marginBottom: "1rem" }}>Create An Account</h5>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign Up
          </button>
        </form>

        <div className="divider">OR</div>

        <div className="social-login">
          {/* Google */}
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-google"></i>
          </a>

          {/* GitHub */}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-github"></i>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>

        <div className="auth-footer">
          Already have an account? <a href="/signup">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
