import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        // Fetch full user data from backend
        const res = await axios.get(
          `http://localhost:8080/api/users/${storedUser._id}`,
          { withCredentials: true }
        );

        setCurrentUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark custom-navbar">
      <div className="container">
        <a className="navbar-brand fw-bold brand-text" href="/">
          <i className="fas fa-project-diagram me-2 brand-icon"></i>
          Project Analyzer
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

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
            <li className="nav-item">
              <a className="nav-link nav-text px-3" href="/new">
                Upload Project
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-text px-3" href="/questions">
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

          <div className="navbar-nav ms-auto">
            {!currentUser ? (
              <>
                <a href="/login" className="nav-link register-link nav-text px-3 fw-semibold">
                  Login
                </a>
                <a href="/signup" className="nav-link nav-text register-link px-3 fw-semibold">
                  Signup
                </a>
              </>
            ) : (
              <>
                <span className="nav-link nav-text px-3 text-capitalize">
                  Hello {currentUser.username || currentUser.name}
                </span>

                <a href="/profile" className="nav-link nav-text px-3">
                  <i className="fas fa-user-circle fs-5 brand-icon"></i>
                </a>

                <a
                  href="/logout"
                  className="nav-link register-link px-3 fw-semibold"
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
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
