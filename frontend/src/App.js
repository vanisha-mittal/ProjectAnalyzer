import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/dashboard.jsx";
import UploadProject from "./pages/UploadProject.jsx";
import Questions from "./pages/Questions";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProjectUpload from "./pages/New";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload-project" element={<UploadProject />} />
            <Route path="/Questions" element={<Questions />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new" element={<ProjectUpload />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
