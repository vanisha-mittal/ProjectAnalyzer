import React, { useState } from "react";
import "./New.css";

export default function ProjectUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSize, setFileSize] = useState("0 MB / 0 MB");
  const [fileName, setFileName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Not connected");
  const [connectionProgress, setConnectionProgress] = useState(0);

  //  Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`0 MB / ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:8080/api/projects"; // backend endpoint

    console.log("📡 Uploading file to backend:", url, "File:", file.name);

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
      console.log("✅ Backend responded with status:", xhr.status);

      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        console.log("Upload complete! Backend response:", res);
      } else {
        console.error("Upload failed.");
      }
    };

    xhr.onerror = () => {
      console.error("Upload error.");
    };

    const formData = new FormData();
    formData.append("file", file);
    xhr.open("POST", url, true);
    xhr.send(formData);
  };

  //  Handle GitHub Connect
  const handleConnect = () => {
    if (repoUrl.trim()) {
      setConnectionStatus("Connecting...");
      setConnectionProgress(0);

      fetch("http://localhost:8080/api/connect-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          setConnectionStatus(data.message);
          setConnectionProgress(100);
          console.log("GitHub connect response:", data); 
        })
        .catch(() => {
          setConnectionStatus("Failed to connect");
        });
    }
  };

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
        <button className="analysis-btn">Start Analysis</button>
      </div>

      <p className="analysis-note">
        Analysis may take several minutes depending on the size and complexity
        of your project
      </p>
    </div>
  );
}



// import React, { useState } from "react";
// import "./New.css";

// export default function ProjectUpload() {
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [fileSize, setFileSize] = useState("0 MB / 0 MB");
//   const [fileName, setFileName] = useState("");
//   const [repoUrl, setRepoUrl] = useState("");
//   const [connectionStatus, setConnectionStatus] = useState("Not connected");
//   const [connectionProgress, setConnectionProgress] = useState(0);

//   //  Handle File Upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFileName(file.name);
//       setFileSize(`0 MB / ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
//       uploadFile(file);
//     }
//   };

//   const uploadFile = (file) => {
//     const xhr = new XMLHttpRequest();
//     const url = "https://httpbin.org/post"; // demo endpoint

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percent = Math.round((event.loaded / event.total) * 100);
//         setUploadProgress(percent);
//         setFileSize(
//           `${(event.loaded / (1024 * 1024)).toFixed(2)} MB / ${(event.total / (1024 * 1024)).toFixed(2)} MB`
//         );
//       }
//     };

//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         console.log("Upload complete!");
//       } else {
//         console.error("Upload failed.");
//       }
//     };

//     xhr.onerror = () => {
//       console.error("Upload error.");
//     };

//     const formData = new FormData();
//     formData.append("file", file);
//     xhr.open("POST", url, true);
//     xhr.send(formData);
//   };

//   //  Handle GitHub Connect
//   const handleConnect = () => {
//     if (repoUrl.trim()) {
//       setConnectionStatus("Connecting...");
//       setConnectionProgress(0);

//       // simulate progress
//       let progress = 0;
//       const interval = setInterval(() => {
//         progress += 10;
//         setConnectionProgress(progress);
//         if (progress >= 100) {
//           clearInterval(interval);
//           setConnectionStatus("Connected to GitHub repository");
//         }
//       }, 300);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleFileUpload({ target: { files: e.dataTransfer.files } });
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   return (
//     <div className="project-upload-container">
//       <h1 className="project-upload-title">Upload Your Project</h1>
//       <p className="project-upload-subtitle">
//         Upload your project files or connect to your GitHub repository to start the analysis process
//       </p>

//       <div className="project-grid">
//   {/* Upload Project Files */}
//   <div className="upload-box">
//     <p>
//       <i className="fa-regular fa-file-zipper"></i> Upload Project Files
//     </p>
//     <div
//       className="drop-zone"
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//     >
//       {fileName ? (
//         <div className="file-selected">
//           <p>File Selected: {fileName}</p>
//           <label className="browse-label custom-btn">
//             Change File
//             <input
//               type="file"
//               onChange={handleFileUpload}
//               style={{ display: "none" }}
//             />
//           </label>
//         </div>
//       ) : (
//         <>
//           <p>
//             <i className="fa-solid fa-cloud-arrow-up"></i>
//           </p>
//           <p>Drag and drop your project files here</p>
//           <p>or</p>
//           <label className="browse-label custom-btn">
//             Browse Files
//             <input
//               type="file"
//               onChange={handleFileUpload}
//               style={{ display: "none" }}
//             />
//           </label>
//         </>
//       )}
//     </div>
 


//           <div className="supported-formats">
//             <p>Supported Formats</p>
//               <p><i class="fa-regular fa-file-zipper"></i> ZIP archives (max 500MB)</p>
//               <p><i class="fa-regular fa-file-code"></i> Source code files (.js, .py, .java, etc.)</p>
//               <p><i class="fa-regular fa-folder"></i> Project folders with structure intact</p>
//           </div>

//           {fileName && (
//             <div className="upload-progress">
//               <p><i class="fa-solid fa-circle-notch"></i> Upload Progress</p>
//               <div className="progress-wrapper">
//                 <progress value={uploadProgress} max="100" />
//                 <span>{uploadProgress}%</span>
//               </div>
//               <small>{fileSize}</small>
//             </div>
//           )}
//         </div>

//         {/* Connect GitHub Repository */}
//         <div className="github-box">
//           <p><i class="fa-brands fa-github"></i> Connect GitHub Repository</p>
//           <div className="github-input-container">
//             <input
//               type="text"
//               placeholder="Enter GitHub repository URL"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//               className="github-input"
//             />
//             <button onClick={handleConnect} className="github-btn custom-btn">
//               Connect
//             </button>
//           </div>

//           <div className="github-info">
//             <p><i class="fa-solid fa-circle-info"></i> GitHub Integration</p>
//             Connect your GitHub repository to analyze your project directly from the source. We
//             support both public and private repositories.
//             <br />
//             <br />
//             You'll need to authenticate with GitHub to grant access to your repositories. We only
//             request read-only access to your code.
//           </div>

//           <div>
//             <p className="status-label"><i class="fa-solid fa-circle-notch"></i> Connection Status</p>
//             <p className="status-text">{connectionStatus}</p>
//             {connectionStatus !== "Not connected" && (
//               <div className="connection-progress">
//                 <div className="progress-wrapper">
//                   <progress value={connectionProgress} max="100" />
//                   <span>{connectionProgress}%</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Start Analysis */}
//       <div className="analysis-container">
//         <button className="analysis-btn">Start Analysis</button>
//       </div>

//       <p className="analysis-note">
//         Analysis may take several minutes depending on the size and complexity of your project
//       </p>
//     </div>
//   );
// }
