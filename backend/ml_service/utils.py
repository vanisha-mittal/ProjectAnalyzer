# backend/ml/utils.py
import os

VALID_EXTENSIONS = {
    ".js", ".jsx", ".ts", ".tsx",
    ".py", ".java", ".c", ".cpp",
    ".php", ".go", ".rb", ".rs",
    ".html", ".css", ".scss", ".json",
    ".md", ".yml", ".yaml"
}

def read_project(directory):
    """Reads all source files from the extracted project"""
    texts = []

    for root, _, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext.lower() in VALID_EXTENSIONS:
                try:
                    with open(os.path.join(root, file), "r", encoding="utf-8", errors="ignore") as f:
                        texts.append(f.read())
                except:
                    pass

    return "\n".join(texts)
