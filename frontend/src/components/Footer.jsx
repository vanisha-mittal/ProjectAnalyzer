import React from "react";

import "./Navbar.css";

const Footer = () => {
  return (
    <footer
      className="pt-5 pb-4"
      style={{ background: "linear-gradient(to right, #0d1b2a, #000000)" }}
    >
      <div className="container">
        <div className="row">
          {/* Brand Info */}
          <div className="col-lg-4 mb-4">
            <h3 className="footer-title mb-3 fw-bold">Project Analyzer</h3>
            <p className="footer-text">
              AI-powered tool to analyze projects, detect technologies, and
              generate insights.
            </p>
          </div>

          {/* Company Links */}
          <div className="col-md-4 col-lg-2 mb-4">
            <h5 className="footer-heading mb-3 fw-bold">Company</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/about" className="footer-link text-decoration-none">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/feedback" className="footer-link text-decoration-none">
                  Feedback
                </a>
              </li>
              <li>
                <a href="/events" className="footer-link text-decoration-none">
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-md-4 col-lg-2 mb-4">
            <h5 className="footer-heading mb-3 fw-bold">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/account" className="footer-link text-decoration-none">
                  Account
                </a>
              </li>
              <li className="mb-2">
                <a href="/faq" className="footer-link text-decoration-none">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="footer-link text-decoration-none">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 col-lg-4 mb-4">
            <h5 className="footer-heading mb-3 fw-bold">Contact Info</h5>
            <address className="footer-text">
              <i className="fas fa-map-marker-alt me-2"></i> 123 Tech Avenue
              <br />
              <i className="fas fa-phone me-2 mt-2"></i> +91 98765 43210
              <br />
              <i className="fas fa-envelope me-2 mt-2"></i>{" "}
              support@projectanalyzer.com
            </address>
          </div>
        </div>

        <hr className="footer-divider my-4" />

        {/* Social Media */}
        <div className="d-flex justify-content-center mb-4">
          <a href="#" className="mx-3 fs-4 footer-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="mx-3 fs-4 footer-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="mx-3 fs-4 footer-link">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="mx-3 fs-4 footer-link">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-md-12 text-center">
            <p className="footer-text mb-0">
              &copy; {new Date().getFullYear()} Project Analyzer. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
