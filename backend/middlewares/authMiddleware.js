// middlewares/authMiddleware.js

// Check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // if API request (JSON expected)
  if (req.originalUrl.startsWith("/api")) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  // if normal web request
  req.flash("error", "You must be logged in first.");
  return res.redirect("/login");
}

// Check if user is admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }

  if (req.originalUrl.startsWith("/api")) {
    return res.status(403).json({ error: "Access denied." });
  }

  req.flash("error", "You don't have permission to access this page.");
  return res.redirect("/projects"); // redirect normal users back
}

module.exports = { isLoggedIn, isAdmin };
