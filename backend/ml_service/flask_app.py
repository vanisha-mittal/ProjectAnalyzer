from flask import Flask, request, jsonify
from analyze_techstack import detect_stack
from pathlib import Path

app = Flask(__name__)
@app.route("/")
def home():
    return "Flask ML service is running 🚀"

@app.route("/stack", methods=["POST"])
def stack():
    data = request.get_json()
    project_path = data.get("project_path")
    if not project_path or not Path(project_path).exists():
        return jsonify({"error": "Invalid or missing project_path"}), 400

    stack = detect_stack(project_path)
    return jsonify(stack)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
