import React from "react";
import "./Auth.css";

function Signup() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signup</h2>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="text" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
