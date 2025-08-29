import React from "react";
import "./Auth.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2><i class="fa-solid fa-chart-column"></i><br />Project Analyzer</h2>

        {/* <div className="auth-tabs">
          <div className="auth-tab active">Login</div>
          <div className="auth-tab">Register</div>
        </div> */}
          <div className="auth-tabs">
            <Link to="/login" className="auth-tab" id="target">Login</Link>
            <Link to="/signup" className="auth-tab" >Register</Link>
          </div>


        <h5 style={{ textAlign: "center", marginBottom: "1rem" }}>Welcome Back</h5>

        <form>
          <label>Email / Username</label>
          <input type="text" placeholder="Enter your email or username" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

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
          {/* Google */}
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-google"></i>
          </a>

          {/* GitHub */}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-github"></i>
          </a>

          {/* Phone (just for demo, opens tel: link) */}

          {/* LinkedIn */}
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
