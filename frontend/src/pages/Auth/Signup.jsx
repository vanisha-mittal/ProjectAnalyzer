import React, { useState } from "react";
import "./Auth.css";

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
        <h1>Project Analyzer</h1>

        {/* Tabs */}
        {/* <div className="auth-tabs">
          <button className="tab">Login</button>
          <button className="tab active">Register</button>
        </div> */}

        <h2 className="welcome-text">Create an Account</h2>

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

          {/* Phone (just for demo, opens tel: link) */}
          <a href="tel:+1234567890">
            <i className="fa-solid fa-phone"></i>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>

        <p className="signup-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
