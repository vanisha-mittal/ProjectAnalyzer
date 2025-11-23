# backend/ml/train_model.py
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# -------------------------------
# 1. Load your dataset
# -------------------------------
# EXAMPLE FORMAT:
# [
#   {
#     "text": "whole project's combined source code here",
#     "labels": ["React", "Node.js", "MongoDB"]
#   }
# ]

DATA_PATH = "dataset.json"   # <=== change to your path

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

texts = [item["text"] for item in data]
labels = [item["labels"] for item in data]

# -------------------------------
# 2. Encode labels
# -------------------------------
mlb = MultiLabelBinarizer()
Y = mlb.fit_transform(labels)

# -------------------------------
# 3. TF-IDF Vectorization
# -------------------------------
vectorizer = TfidfVectorizer(
    max_features=5000,
    stop_words="english",
    ngram_range=(1, 2),
)

X = vectorizer.fit_transform(texts)

# -------------------------------
# 4. Train/Test Split
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42
)

# -------------------------------
# 5. Train RandomForest
# -------------------------------
model = RandomForestClassifier(
    n_estimators=350,
    max_depth=None,
    class_weight="balanced",
    n_jobs=-1,
)

model.fit(X_train, y_train)

# -------------------------------
# 6. Evaluate
# -------------------------------
y_pred = model.predict(X_test)
print("\n\n=== Classification Report ===\n")
print(classification_report(y_test, y_pred, target_names=mlb.classes_))

# -------------------------------
# 7. Save Model Bundle
# -------------------------------
import os

# Create directory if not exists
SAVE_DIR = "model"
os.makedirs(SAVE_DIR, exist_ok=True)

# Create the bundle (YOU MISSED THIS PART)
bundle = {
    "vectorizer": vectorizer,
    "model": model,
    "mlb": mlb,
}

SAVE_PATH = os.path.join(SAVE_DIR, "techstack_model.joblib")
joblib.dump(bundle, SAVE_PATH)

print(f"\n\n🌟 Model saved successfully to {SAVE_PATH}")
