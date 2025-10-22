import os, json, joblib
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from utils import read_project

def load_frameworks(base='datasets/frameworks'):
    texts, labels = [], []
    p = Path(base)
    if not p.exists():
        print('[!] frameworks dataset folder missing:', base)
        return texts, labels
    for folder in p.iterdir():
        if folder.is_dir():
            label_file = folder / 'labels.json'
            if label_file.exists():
                try:
                    lbl = json.load(open(label_file, 'r', encoding='utf-8'))
                except Exception:
                    lbl = [folder.name]
            else:
                lbl = [folder.name]
            text = read_project(str(folder))
            texts.append(text)
            labels.append(lbl)
    return texts, labels

def train_framework_model():
    texts, labels = load_frameworks()
    print(f"Loaded {len(texts)} framework projects")

    if len(texts) < 2:
        print('Not enough framework projects to train.')
        return

    mlb = MultiLabelBinarizer()
    y = mlb.fit_transform(labels)
    vectorizer = TfidfVectorizer(max_features=10000, token_pattern=r'\w+', lowercase=False)
    X = vectorizer.fit_transform(texts)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(n_estimators=150, random_state=42)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    print(classification_report(y_test, y_pred, target_names=mlb.classes_))

    os.makedirs('models', exist_ok=True)
    joblib.dump((clf, vectorizer, mlb), os.path.join('models','framework_detector.pkl'))
    print('✅ Saved framework detector model to models/framework_detector.pkl')

if __name__ == '__main__':
    train_framework_model()
