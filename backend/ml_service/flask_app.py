# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import os
# from utils import read_project
# from rules import detect_tech_stack

# # --- QUESTION GENERATION IMPORTS ---
# import pickle
# import torch
# from sentence_transformers import SentenceTransformer

# app = Flask(__name__)
# CORS(app)

# # ----------------- LOAD TECHSTACK CLASSIFICATION MODEL -----------------
# MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "techstack_model.joblib")
# bundle = joblib.load(MODEL_PATH)

# vectorizer = bundle["vectorizer"]
# model = bundle["model"]
# mlb = bundle["mlb"]

# # ----------------- LOAD QUESTION GENERATION DATA -----------------
# MODEL_FOLDER = os.path.join(os.path.dirname(__file__), "model")

# # Load dataset
# # Load dataset
# df = pickle.load(open(os.path.join(MODEL_FOLDER, "dataset.pkl"), "rb"))
# print("DATASET COLUMNS:", df.columns)


# # ----------------- LOAD EMBEDDINGS (FIXED CPU MODE) -----------------
# import torch

# emb_path = os.path.join(MODEL_FOLDER, "embeddings.pkl")

# # Load torch CUDA-saved embeddings safely on CPU
# embeddings = torch.load(
#     emb_path,
#     map_location=torch.device("cpu"),
#     weights_only=False  # allow legacy pickle protocol
# ).cpu()

# print("LOADED EMBEDDINGS SHAPE:", embeddings.shape)

# # Ensure tensor on CPU
# embeddings = embeddings.cpu()

# print("EMBED SHAPE:", embeddings.shape)
# print("EMBED TYPE:", type(embeddings))


# # Load sentence transformer model
# qe_model = SentenceTransformer("all-MiniLM-L6-v2")



# def get_question_from_techstack(techstack):
#     query_embedding = qe_model.encode(techstack, convert_to_tensor=True).cpu()

#     # Expand to compare with all rows in dataset
#     scores = torch.nn.functional.cosine_similarity(
#     query_embedding, embeddings, dim=1
#     )

#     top_idx = torch.argmax(scores).item()
#     return df.iloc[top_idx]["question"]


# # ----------------- ROUTES -----------------
# @app.route("/health", methods=["GET"])
# def health():
#     return {"status": "ml alive"}, 200


# @app.route("/predict/path", methods=["POST"])
# def predict_path():
#     data = request.get_json()
#     print("📥 RAW incoming data:", data)

#     project_path = data.get("projectPath")
#     print("📂 projectPath received:", project_path)

#     if not project_path or not os.path.exists(project_path):
#         return {"error": "Invalid path", "received": str(project_path)}, 400

#     # Read project code
#     code_text = read_project(project_path)

#     # Detect tech stack
#     techstack = detect_tech_stack(project_path)
#     joined_tech = " ".join(techstack)

#     # Generate question
#     question = get_question_from_techstack(joined_tech)
#     print("❓ Generated Question:", question)

#     return {
#         "techstack": list(techstack),
#         "folder": project_path,
#         "question": question
#     }, 200


# if __name__ == "__main__":
#     app.run(port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from utils import read_project
from rules import detect_tech_stack

# --- QUESTION GENERATION IMPORTS ---
import pickle
import torch
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)

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

# Load sentence transformer
qe_model = SentenceTransformer("all-MiniLM-L6-v2")

import random

import numpy as np

def generate_question_from_code(code_text, techstack):
    if not code_text:
        code_text = " ".join(techstack)

    query_embedding = qe_model.encode(code_text, convert_to_tensor=True).cpu()

    # Cosine similarity with embeddings dataset
    scores = torch.nn.functional.cosine_similarity(query_embedding, embeddings, dim=1)

    # Get diverse top-10 questions
    top_k = min(10, len(df))
    top_indices = torch.topk(scores, k=top_k).indices.numpy()

    # Random pick to avoid repetition
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

    project_path = data.get("projectPath")
    print("📂 projectPath received:", project_path)

    if not project_path or not os.path.exists(project_path):
        return {"error": "Invalid path", "received": str(project_path)}, 400

    # Read project files
    code_text = read_project(project_path)

    # Detect tech stack
    techstack = detect_tech_stack(project_path)
    if not techstack:
        techstack = ["Unknown"]

    # Generate more relevant question using code
    result = generate_question_from_code(code_text, techstack)

    print("❓ Generated:", result["question"])

    return {
        "techstack": techstack,
        "projectPath": project_path,
        "question": result["question"],
        "difficulty": result["difficulty"]
    }, 200


if __name__ == "__main__":
    app.run(port=5000)
