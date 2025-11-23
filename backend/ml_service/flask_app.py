    # backend/ml/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from utils import read_project
from rules import detect_tech_stack

app = Flask(__name__)
CORS(app)

# Load ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "techstack_model.joblib")
bundle = joblib.load(MODEL_PATH)

vectorizer = bundle["vectorizer"]
model = bundle["model"]
mlb = bundle["mlb"]

@app.route("/health", methods=["GET"])
def health():
    return {"status": "ml alive"}, 200

@app.route("/predict/path", methods=["POST"])
def predict_path():
    data = request.get_json()
    print("📥 RAW incoming data:", data)

    project_path = data.get("projectPath")
    print("📂 projectPath received:", project_path)

    if not project_path or not os.path.exists(project_path):
        print("❌ Invalid project path!")
        return {"error": "Invalid path", "received": str(project_path)}, 400


    # Read project files
    try:
        code_text = read_project(project_path)
    except Exception as e:
        return jsonify({"error": f"Failed reading project: {str(e)}"}), 500

    try:
        X = vectorizer.transform([code_text])
    except Exception as e:
        return jsonify({"error": f"Vectorizer error: {str(e)}"}), 500

    try:
        y_pred = model.predict(X)
    except Exception as e:
        return jsonify({"error": f"Model prediction error: {str(e)}"}), 500

    techstack = detect_tech_stack(project_path)
    print("TEXT LENGTH:", len(code_text))
    print("RULE OUTPUT:", techstack)



    return {
        "techstack": list(techstack),
        "folder": project_path
    }, 200


if __name__ == "__main__":
    app.run(port=5000)
