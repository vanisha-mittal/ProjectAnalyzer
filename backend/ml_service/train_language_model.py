import os
import joblib
import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

def load_dataset(csv_path='./datasets/codesearchnet/techstack_dataset.csv'):
    """Load the tech stack dataset from CSV."""
    if not os.path.exists(csv_path):
        print(f"[!] Dataset not found at: {csv_path}")
        return None

    df = pd.read_csv(csv_path)
    required_cols = {'file_content', 'tech_stack'}
    if not required_cols.issubset(df.columns):
        print(f"[!] Missing required columns in dataset: {required_cols - set(df.columns)}")
        return None

    texts = df['file_content'].astype(str).tolist()
    labels = df['tech_stack'].astype(str).tolist()
    return texts, labels


def train_lang_detector():
    # Load dataset
    texts, labels = load_dataset()
    if not texts or len(texts) < 2:
        print("[!] Not enough data to train.")
        return

    print(f"✅ Loaded {len(texts)} samples for tech stack detection.")

    # Encode labels
    le = LabelEncoder()
    y = le.fit_transform(labels)

    # Vectorize code text using TF-IDF (works well for programming text)
    vectorizer = TfidfVectorizer(
        analyzer='char_wb',  # character-level n-grams for code robustness
        ngram_range=(3, 6),
        max_features=10000,
        lowercase=False
    )
    X = vectorizer.fit_transform(texts)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model (Random Forest)
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    )

    print("🚀 Training RandomForestClassifier...")
    clf.fit(X_train, y_train)

    # Evaluate
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n🎯 Accuracy: {acc*100:.2f}%\n")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    # Save model
    os.makedirs('models', exist_ok=True)
    model_path = os.path.join('models', 'lang_detector_csnet.pkl')
    joblib.dump((clf, vectorizer, le), model_path)
    print(f"✅ Saved tech stack detector model to {model_path}")


if __name__ == "__main__":
    train_lang_detector()
