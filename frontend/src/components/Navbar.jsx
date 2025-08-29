// src/components/Navbar.jsx
import React from "react";
import "./Navbar.css"; // Import the CSS file for styling

function Navbar({ currentUser }) {
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark custom-navbar">
      <div className="container">
        {/* Brand */}
        <a className="navbar-brand fw-bold brand-text" href="/">
          <i className="fas fa-project-diagram me-2 brand-icon"></i>
          Project Analyzer
        </a>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link nav-text px-3" href="/">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link nav-text px-3" href="/dashboard">
                Dashboard
              </a>
    
            </li>
            <li><a className="nav-link nav-text px-3" href="/UploadProject">
                Uploads
              </a>
              </li>
              <li>
                 <a className="nav-link nav-text px-3" href="/Questions">
               Questions
              </a>
              </li>
            {currentUser && currentUser.role === "admin" && (
              <li className="nav-item">
                <a className="nav-link nav-text px-3" href="/admin">
                  Admin Panel
                </a>
              </li>
            )}
          </ul>

          {/* Right side */}
          <div className="navbar-nav ms-auto">
            {!currentUser ? (
              <>
                <a href="/login" className="nav-link register-link nav-text px-3 fw-semibold">
                  Login
                </a>
                <a
                  href="/signup"
                  className="nav-link nav-text register-link px-3 fw-semibold"
                >
                  Signup
                </a>
              </>
            ) : (
              <>
                <span className="nav-link nav-text px-3 text-capitalize">
                  👋 Hello {currentUser.username}
                </span>

                <a href="/profile" className="nav-link nav-text px-3">
                  <i className="fas fa-user-circle fs-5 brand-icon"></i>
                </a>

                <a
                  href="/logout"
                  className="nav-link register-link px-3 fw-semibold"
                >
                  Logout
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
