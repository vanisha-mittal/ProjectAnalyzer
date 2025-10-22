// utils/runPython.js
const { spawn } = require("child_process");
const path = require("path");

function runTechDetector(targetPath) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../ml/detector.py"),
      targetPath,
    ]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(error || "Python script failed"));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}

module.exports = { runTechDetector };
