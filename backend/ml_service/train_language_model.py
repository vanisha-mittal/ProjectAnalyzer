import os
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report


def load_codesearchnet(data_dir, langs=None, max_per_lang=5000):
    if langs is None:
        langs = ['python', 'java', 'javascript']
    texts, labels = [], []

    for lang in langs:
        path = os.path.join(data_dir, lang, f"{lang}.train.jsonl")
        if not os.path.exists(path):
            print(f"[!] Missing: {path}, skipping")
            continue

        with open(path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                if i >= max_per_lang:
                    break
                try:
                    obj = json.loads(line)
                    code = obj.get('code','').strip()
                    if not code:
                        continue
                    texts.append(code)
                    labels.append(lang.capitalize())
                except Exception:
                    continue
    return texts, labels


def train_language_model(data_dir='./datasets/codesearchnet', max_samples=2000):
    texts, labels = load_codesearchnet(data_dir, max_per_lang=max_samples)
    print(f"Loaded {len(texts)} samples for language training")

    if len(texts) < 2:
        print("Not enough data to train.")
        return

    le = LabelEncoder()
    y = le.fit_transform(labels)

    vectorizer = TfidfVectorizer(max_features=20000, token_pattern=r'\w+', lowercase=False)
    X = vectorizer.fit_transform(texts)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y if len(set(y))>1 else None, random_state=42
    )

    clf = RandomForestClassifier(n_estimators=200, random_state=42)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    print(classification_report(y_test, y_pred, target_names=le.classes_))

    os.makedirs('models', exist_ok=True)
    joblib.dump(clf, os.path.join('models','lang_detector_csnet.pkl'))
    joblib.dump(vectorizer, os.path.join('models','vectorizers_lang_vectorizer.pkl'))
    joblib.dump(le, os.path.join('models','lang_label_encoder.pkl'))
    print('✅ Saved language model and vectorizer to models/')


if __name__ == "__main__":
    train_language_model()
