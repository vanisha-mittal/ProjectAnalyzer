import React, { useState } from "react";
import "./New.css";

export default function ProjectUpload() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSize, setFileSize] = useState("0 MB / 0 MB");
  const [fileName, setFileName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Not connected");
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [analysisStatus, setAnalysisStatus] = useState("");

  // --- Handle File Upload ---
 const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (file) {
    const autoName = file.name.replace(".zip", "");

    setProjectName(autoName);          // auto-set project name
    setFileName(file.name);
    setFileSize(`0 MB / ${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    uploadFile(file, autoName);        // pass project name
  }
};


  const uploadFile = (file, autoName) => {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:8080/api/projects/upload/zip"; // ✅ backend endpoint

    console.log("Uploading file to backend:", url, "File:", file.name);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
        setFileSize(
          `${(event.loaded / (1024 * 1024)).toFixed(2)} MB / ${(event.total / (1024 * 1024)).toFixed(2)} MB`
        );
      }
    };

    xhr.onload = () => {
      console.log("Backend responded with status:", xhr.status);

      if (xhr.status === 201) {
        const res = JSON.parse(xhr.responseText);
        console.log("✅ Upload complete:", res);
        alert("Tech stack analysis complete! Check your console for results.");
      } else {
        console.error("❌ Upload failed:", xhr.responseText);
        alert(`Upload failed. ${xhr.responseText}`);
      }
    };

    xhr.onerror = () => {
      console.error("❌ Upload error.");
    };

    const formData = new FormData();
    formData.append("projectZip", file); // ✅ must match multer field name
    formData.append("projectName", autoName);
    formData.append("author", userId);

    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  // --- Handle GitHub Connect ---
  const handleConnect = () => {
    if (repoUrl.trim()) {
      setConnectionStatus("Connecting...");
      setConnectionProgress(0);

      fetch("http://localhost:8080/api/projects/upload/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          githubLink: repoUrl,
          author: "670f5e82d42a41255c20e12f",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setConnectionStatus("Connected");
          setConnectionProgress(100);
          console.log("✅ GitHub link saved:", data);
        })
        .catch(() => setConnectionStatus("Failed to connect"));
    } else {
      alert("Please enter a GitHub repository URL.");
    }
  };

  // --- Start Tech Stack Analysis ---
  const handleStartAnalysis = async () => {
    if (!repoUrl.trim()) {
      alert("Please enter a GitHub repository URL first.");
      return;
    }

    setAnalysisStatus("Analyzing...");
    try {
      const res = await fetch("http://localhost:8080/api/projects/analyze/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubLink: repoUrl,
          projectName: projectName || "GitHub Project",
          author: "670f5e82d42a41255c20e12f",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnalysisStatus("Analysis complete ✅");
        console.log("Analysis result:", data);
      } else {
        setAnalysisStatus("Analysis failed ❌");
        console.error(data.error);
      }
    } catch (err) {
      setAnalysisStatus("Error during analysis ❌");
      console.error(err);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="project-upload-container">
      <h1 className="project-upload-title">Upload Your Project</h1>
      <p className="project-upload-subtitle">
        Upload your project files or connect to your GitHub repository to start
        the analysis process
      </p>

      <div className="project-grid">
        {/* Upload Project Files */}
        <div className="upload-box">
          <p>
            <i className="fa-regular fa-file-zipper"></i> Upload Project Files
          </p>
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {fileName ? (
              <div className="file-selected">
                <p>File Selected: {fileName}</p>
                <label className="browse-label custom-btn">
                  Change File
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            ) : (
              <>
                <p>
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </p>
                <p>Drag and drop your project files here</p>
                <p>or</p>
                <label className="browse-label custom-btn">
                  Browse Files
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </>
            )}
          </div>

          <div className="supported-formats">
            <p>Supported Formats</p>
            <p>
              <i className="fa-regular fa-file-zipper"></i> ZIP archives (max
              50MB)
            </p>
            <p>
              <i className="fa-regular fa-file-code"></i> Source code files
              (.js, .py, .java, etc.)
            </p>
            <p>
              <i className="fa-regular fa-folder"></i> Project folders with
              structure intact
            </p>
          </div>

          {fileName && (
            <div className="upload-progress">
              <p>
                <i className="fa-solid fa-circle-notch"></i> Upload Progress
              </p>
              <div className="progress-wrapper">
                <progress value={uploadProgress} max="100" />
                <span>{uploadProgress}%</span>
              </div>
              <small>{fileSize}</small>
            </div>
          )}
        </div>

        {/* Connect GitHub Repository */}
        <div className="github-box">
          <p>
            <i className="fa-brands fa-github"></i> Connect GitHub Repository
          </p>
          <div className="github-input-container">
            <input
              type="text"
              placeholder="Enter GitHub repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="github-input"
            />
            <button onClick={handleConnect} className="github-btn custom-btn">
              Connect
            </button>
          </div>

          <div className="github-info">
            <p>
              <i className="fa-solid fa-circle-info"></i> GitHub Integration
            </p>
            Connect your GitHub repository to analyze your project directly from
            the source. We support both public and private repositories.
            <br />
            <br />
            You'll need to authenticate with GitHub to grant access to your
            repositories. We only request read-only access to your code.
          </div>

          <div>
            <p className="status-label">
              <i className="fa-solid fa-circle-notch"></i> Connection Status
            </p>
            <p className="status-text">{connectionStatus}</p>
            {connectionStatus !== "Not connected" && (
              <div className="connection-progress">
                <div className="progress-wrapper">
                  <progress value={connectionProgress} max="100" />
                  <span>{connectionProgress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Analysis */}
      <div className="analysis-container">
        <button className="analysis-btn" onClick={handleStartAnalysis}>
          Start Analysis
        </button>
      </div>

      <p className="analysis-note">
        {analysisStatus
          ? `Status: ${analysisStatus}`
          : "Analysis may take several minutes depending on the size and complexity of your project"}
      </p>
    </div>
  );
}
