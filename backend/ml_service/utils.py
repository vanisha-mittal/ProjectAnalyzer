import os
from pathlib import Path

def read_project(path, read_chars=2000):
    """Read a project directory and return combined text + extensions."""
    texts = []
    exts = []
    for root, _, files in os.walk(path):
        for f in files:
            ext = Path(f).suffix.lower()
            exts.append(ext)
            try:
                with open(os.path.join(root, f), 'r', encoding='utf-8', errors='ignore') as fp:
                    texts.append(fp.read(read_chars))
            except Exception:
                continue
    return "\n".join(texts) + " " + " ".join(set(exts))
