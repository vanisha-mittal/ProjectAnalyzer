// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
   

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-blue-900 via-black to-blue-950">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Project Analyzer
        </h1>
        <p className="text-lg max-w-2xl mb-8 text-gray-300">
          An AI-powered tool to analyze, question, and improve your projects.
          Get instant insights, detect risks, and make smarter decisions with AI.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 text-black transition"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          How Project Analyzer Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg hover:bg-blue-700 transition">
            <h3 className="text-xl font-semibold mb-4">1. Upload Project</h3>
            <p className="text-gray-300">
              Provide project details, documents, or goals for AI to analyze.
            </p>
          </div>
          <div className="bg-blue-700 p-6 rounded-lg shadow-lg hover:bg-blue-600 transition">
            <h3 className="text-xl font-semibold mb-4">2. AI Analysis</h3>
            <p className="text-gray-300">
              Our AI scans your project, identifies risks, and generates insights.
            </p>
          </div>
          <div className="bg-blue-600 p-6 rounded-lg shadow-lg hover:bg-blue-500 transition">
            <h3 className="text-xl font-semibold mb-4">3. Get Recommendations</h3>
            <p className="text-gray-300">
              Receive clear suggestions, project improvements, and answers to your questions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-black via-blue-900 to-black">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Analyze Your Project with AI?
        </h2>
        <Link
          to="/dashboard"
          className="bg-blue-500 px-8 py-3 rounded-lg font-semibold text-black hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </Link>
      </section>

    </div>
  );
};

export default Home;
