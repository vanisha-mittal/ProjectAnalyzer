from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from utils import read_project
from rules import detect_tech_stack
import pickle
import torch
from sentence_transformers import SentenceTransformer
import sqlite3
from datetime import datetime
from bson import ObjectId

 
app = Flask(__name__)
CORS(app)


DB_PATH = os.path.join(os.path.dirname(__file__), "questions.db")

from pymongo import MongoClient
from datetime import datetime
import os

# ----------------- CONFIG -----------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "project_analyzer"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
projects_collection = db["projects"]  # Your Project collection

# ----------------- SAVE QUESTION TO PROJECT -----------------
def save_question_to_project(project_id, question, tech, difficulty):
    try:
        update_result = projects_collection.update_one(
            {"_id": ObjectId(project_id)},  # <-- FIXED
            {
                "$push": {
                    "questions": {
                        "question": question,
                        "tech": tech,
                        "difficulty": difficulty,
                        "createdAt": datetime.now()
                    },
                    "analysisLogs": {
                        "message": f"Generated question: {question}",
                        "createdAt": datetime.now()
                    }
                },
                "$set": {"analysisStatus": "success"}
            }
        )

        if update_result.matched_count:
            print(f"💾 Saved to Project {project_id} | Question: {question}")
        else:
            print(f"❌ Project {project_id} not found!")

    except Exception as e:
        print("❌ DB Error:", e)



# ----------------- LOAD TECHSTACK CLASSIFICATION MODEL -----------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "techstack_model.joblib")
bundle = joblib.load(MODEL_PATH)

vectorizer = bundle["vectorizer"]
model = bundle["model"]
mlb = bundle["mlb"]

# ----------------- LOAD QUESTION GENERATION DATA -----------------
MODEL_FOLDER = os.path.join(os.path.dirname(__file__), "model")

# Load dataset
df = pickle.load(open(os.path.join(MODEL_FOLDER, "dataset.pkl"), "rb"))
print("DATASET COLUMNS:", df.columns)

# ----------------- LOAD CPU-SAFE EMBEDDINGS -----------------
emb_path = os.path.join(MODEL_FOLDER, "embeddings_cpu.pt")

if not os.path.exists(emb_path):
    raise FileNotFoundError("\n❌ embeddings_cpu.pt not found!\n👉 Run fix_embeddings.py on GPU machine first.\n")

embeddings = torch.load(emb_path, map_location=torch.device("cpu"))
embeddings = embeddings.cpu()

print("✔ Loaded CPU embeddings:", embeddings.shape)

qe_model = SentenceTransformer("all-MiniLM-L6-v2")

import random

import numpy as np

def generate_question_from_code(code_text, techstack):
    if not code_text:
        code_text = " ".join(techstack)

    query_embedding = qe_model.encode(code_text, convert_to_tensor=True).cpu()

    scores = torch.nn.functional.cosine_similarity(query_embedding, embeddings, dim=1)

    top_k = min(10, len(df))
    top_indices = torch.topk(scores, k=top_k).indices.numpy()

    selected = np.random.choice(top_indices)

    row = df.iloc[selected]

    return {
        "question": row["question"],
        "tech": row["tech"],
        "difficulty": row["difficulty"]
    }

# ----------------- ROUTES -----------------
@app.route("/health", methods=["GET"])
def health():
    return {"status": "ml alive"}, 200


@app.route("/predict/path", methods=["POST"])
def predict_path():
    data = request.get_json()
    print("📥 RAW incoming data:", data)

    project_id = data.get("projectId")  # Pass this from frontend
    project_path = data.get("projectPath")
    print("📂 projectPath received:", project_path)

    if not project_path or not os.path.exists(project_path):
        return {"error": "Invalid path", "received": str(project_path)}, 400

    code_text = read_project(project_path)

    # detect techstack
    techstack = detect_tech_stack(project_path)
    if not techstack:
        techstack = ["Unknown"]

    # generates questions
    result = generate_question_from_code(code_text, techstack)

    print("❓ Generated:", result["question"])
    save_question_to_project(project_id, result["question"], techstack, result["difficulty"])

    return {
        "techstack": techstack,
        "projectPath": project_path,
        "question": result["question"],
        "difficulty": result["difficulty"]
    }, 200


if __name__ == "__main__":
    app.run(port=5000)


# Questions related to given techstack are generated