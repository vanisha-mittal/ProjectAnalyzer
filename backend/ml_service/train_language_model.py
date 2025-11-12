
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder

# 1️⃣ Load dataset
df = pd.read_csv("./datasets/codesearchnet/techstack_dataset.csv")

print("✅ Dataset loaded:", df.shape)
print(df.head())

# 2️⃣ Encode labels
le = LabelEncoder()
df["tech_stack_encoded"] = le.fit_transform(df["tech_stack"])

# 3️⃣ Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    df["file_content"], df["tech_stack_encoded"], test_size=0.2, random_state=42
)

# 4️⃣ Create pipeline: TF-IDF + Logistic Regression
model = make_pipeline(
    TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 6), max_features=5000),
    LogisticRegression(max_iter=200)
)

# 5️⃣ Train model
model.fit(X_train, y_train)

# 6️⃣ Evaluate
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print("\n🎯 Accuracy:", round(acc * 100, 2), "%")
print("\n📋 Classification Report:\n", classification_report(y_test, y_pred, target_names=le.classes_))

# 7️⃣ Try new predictions
samples = [
    "from flask import Flask; app = Flask(__name__)",
    "import React from 'react'; function App() { return <div>Hi</div>; }",
    "package main; import 'fmt'; func main() { fmt.Println('Go!') }",
    "using Microsoft.AspNetCore.Mvc;"
]

preds = model.predict(samples)
decoded_preds = le.inverse_transform(preds)

print("\n🔮 Sample Predictions:")
for text, pred in zip(samples, decoded_preds):
    print(f" - {pred}: {text[:60]}...")
