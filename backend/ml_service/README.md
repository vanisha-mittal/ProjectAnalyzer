# ProjectAnalyzer - ML Service (mini package)

## Overview
This package contains a mini CodeSearchNet sample dataset, example framework projects,
training scripts for language and framework detection, and a downloader script to
fetch the full CodeSearchNet dataset.

## Quickstart (Windows)

1. Create virtual environment and install dependencies:
   ```powershell
   cd ProjectAnalyzer\backend\ml_service
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. (Optional) Download full CodeSearchNet (large, ~20GB):
   ```powershell
   cd datasets\codesearchnet
   python download_and_load.py
   ```

3. Train language model:
   ```powershell
   cd ..\..
   python train_language_model.py
   ```
   

4. Train framework model:
   ```powershell
   python train_framework_model.py
   ```

5. Predict:
   ```powershell
   python predict_techstack.py path\to\some_project
   ```

## Notes
- The mini datasets are tiny and intended for quick testing.
- Use the downloader script only if you want the full dataset and have sufficient disk space.
- Models will be saved in the `models/` folder after training.
