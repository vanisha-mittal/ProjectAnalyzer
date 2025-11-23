    # backend/ml/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from utils import read_project

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
    """
    Input JSON:
    { "projectPath": "C:/backend/uploads/12345/extracted" }
    """
    data = request.get_json()
    project_path = data.get("projectPath")

    if not project_path:
        return {"error": "projectPath is missing"}, 400


    if not os.path.exists(project_path):
        return {"error": "Invalid path"}, 400

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

    from rules import detect_tech_stack
    techstack = detect_tech_stack(project_path)


    return {
        "techstack": list(techstack),
        "folder": project_path
    }, 200


if __name__ == "__main__":
    app.run(port=5000)
