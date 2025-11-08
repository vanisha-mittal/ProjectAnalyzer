import os
import sys
import joblib
from utils import read_project

# Optional auto-training import
from train_language_model import train_language_model


def ensure_language_model():
    """
    Ensures that the language model exists.
    If not, trains it online using CodeSearchNet subset.
    """
    lang_model_path = os.path.join("models", "lang_detector_csnet.pkl")
    lang_vec_path = os.path.join("models", "vectorizers_lang_vectorizer.pkl")
    lang_le_path = os.path.join("models", "lang_label_encoder.pkl")

    if not (os.path.exists(lang_model_path) and os.path.exists(lang_vec_path) and os.path.exists(lang_le_path)):
        print("[] Language model not found. Training a new one using CodeSearchNet...")
        train_language_model(use_online_dataset=True)
        print("[] Language model trained successfully.")

    return (
        joblib.load(lang_model_path),
        joblib.load(lang_vec_path),
        joblib.load(lang_le_path)
    )


def predict_techstack(path):
    lang_model_path = os.path.join('models','lang_detector_csnet.pkl')
    fw_model_path = os.path.join('models','framework_detector.pkl')

    # Load / train language model
    clf, vec, le = ensure_language_model()

    text = read_project(path)

    lang_pred = clf.predict(vec.transform([text]))[0]
    language = le.inverse_transform([lang_pred])[0] if hasattr(le, 'inverse_transform') else str(lang_pred)

    frameworks = []
    if os.path.exists(fw_model_path):
        fw_clf, fw_vec, fw_mlb = joblib.load(fw_model_path)
        fw_pred = fw_clf.predict(fw_vec.transform([text]))
        frameworks = fw_mlb.inverse_transform(fw_pred)[0]

    result = {'language': language, 'frameworks': list(frameworks)}
    return result


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python predict_techstack.py path/to/project')
        sys.exit(1)

    path = sys.argv[1]
    res = predict_techstack(path)
    print(' Detected tech stack:', res)
