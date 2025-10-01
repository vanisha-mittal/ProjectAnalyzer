import React from "react";
import { Link } from "react-router-dom";

export default function ProjectAnalyzer() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#0B1221", color: "#fff", margin: 0, padding: 0 }}>
      {/* Navbar */}
      
      <header style={{ backgroundColor: "#0F172A", padding: "15px 50px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }}>
        <h2 style={{ color: "#60A5FA", margin: 0 }}>Project Analyzer</h2>
        <nav>
          <a href="#features" style={navLink}>Features</a>
          <a href="#how" style={navLink}>How it works</a>
          <a href="#pricing" style={navLink}>Pricing</a>
          <a href="#contact" style={navLink}>Contact</a>
          <button style={buttonPrimary}>Get Started</button>
        </nav>
      </header>
      {/* Hero Section */}
      <section style={{ textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: "44px", fontWeight: "bold", lineHeight: "1.4" }}>
          Analyze <span style={gradientText}>Projects.</span><br />
          Generate <span style={gradientText}>Questions.</span><br />
          Ace <span style={gradientText}>Interviews.</span>
        </h1>
        <p style={{ marginTop: "20px", color: "#94a3b8", maxWidth: "650px", margin: "20px auto", fontSize: "18px", lineHeight: "1.6" }}>
          Project Analyzer helps students practice according to their project’s tech stack and allows interviewers to generate relevant questions tailored to specific roles and technologies.
        </p>
        {/* <button style={{ ...buttonPrimary, padding: "14px 30px", fontSize: "16px" }}>Try it Free</button> */}
        <Link to="/New" style={{ ...buttonPrimary, display: "inline-block", textAlign: "center", padding: "14px 30px", fontSize: "16px", textDecoration: "none", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Try It For Free</Link>
     
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "30px", marginBottom: "50px" }}>Powerful Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "35px", maxWidth: "1100px", margin: "0 auto" }}>
          {[
            {title: "Automated Project Analysis", desc: "AI scans your codebase to identify languages, frameworks, and generates instant practice questions." },
            {title: "Dynamic Question Generation", desc: "Generate custom questions based on your project. No two quizzes are ever the same." },
            {title: "Interview Mode Refresh", desc: "Timed sessions and instant scoring to simulate real interviews." },
            {title: "Adaptive Questioning", desc: "Questions adapt in real-time based on your strengths and weaknesses." },
            {title: "GitHub Integration", desc: "Connect directly to your GitHub repo to generate project-specific analysis." },
            {title: "Role-Based Questioning", desc: "Tailor interview sets for developer, tester, or full-stack roles." }
          ].map((f, i) => (
            <div key={i} style={card}>
              <h3 style={{ color: "#3b82f6", fontSize: "20px", margin: "15px 0" }}>{f.title}</h3>
              <p style={{ color: "#94a3b8", lineHeight: "1.5" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ padding: "90px 20px", textAlign: "center", backgroundColor: "#111827" }}>
        <h2 style={{ fontSize: "30px", marginBottom: "50px" }}>How It Works</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap" }}>
          {[
            { step: "1", title: "Connect Your Project", desc: "Link your GitHub repository or upload project files for AI to analyze your tech stack." },
            { step: "2", title: "Customize Questions", desc: "Select roles, difficulty levels, and technologies you want to focus on." },
            { step: "3", title: "Practice & Improve", desc: "Answer project-specific questions, receive feedback, and track progress over time." }
          ].map((s, i) => (
            <div key={i} style={{ width: "280px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", backgroundColor: "#2563eb", width: "55px", height: "55px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 20px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>{s.title}</h3>
              <p style={{ color: "#94a3b8", lineHeight: "1.5" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section style={{ backgroundColor: "#0F172A", padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Ready to Transform Your Interview Prep?</h2>
        <p style={{ color: "#94a3b8", maxWidth: "650px", margin: "0 auto 30px", fontSize: "17px", lineHeight: "1.6" }}>
          Join thousands of developers who are using Project Analyzer to level up their technical interview skills.
        </p>
       <Link to="/New" style={{ ...buttonPrimary, display: "inline-block", textAlign: "center", padding: "14px 30px", fontSize: "16px", textDecoration: "none", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Start Free Trial</Link>
      </section>
    </div>
  );
}

// Reusable styles
const buttonPrimary = {
  backgroundColor: "#2563eb",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
};
buttonPrimary[":hover"] = {
  backgroundColor: "#1e40af"
};

const navLink = {
  margin: "0 15px",
  color: "#cbd5e1",
  textDecoration: "none",
  fontSize: "15px",
  position: "relative",
};
navLink[":hover"] = {
  color: "#60A5FA",
  textDecoration: "underline",
};

const gradientText = {
  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const card = {
  backgroundColor: "#1E293B",
  padding: "25px",
  borderRadius: "12px",
  textAlign: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};
card[":hover"] = {
  transform: "translateY(-6px)",
  boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
};










