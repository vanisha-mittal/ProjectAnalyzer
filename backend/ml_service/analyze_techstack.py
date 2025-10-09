import os
import json
from pathlib import Path

def detect_stack(project_path):
    """
    Analyze a given project directory to detect tech stack components.
    Returns a dictionary with detected languages, frameworks, and tools.
    """

    # --- Supported keywords for detection ---
    tech_keywords = {   
        "languages": {
            ".py": "Python",
            ".js": "JavaScript",
            ".ts": "TypeScript",
            ".java": "Java",
            ".cpp": "C++",
            ".c": "C",
            ".cs": "C#",
            ".php": "PHP",
            ".html": "HTML",
            ".css": "CSS",
            ".rb": "Ruby",
        },
        "frameworks": {
            # Python
            "flask": "Flask",
            "django": "Django",
            "fastapi": "FastAPI",
            # JavaScript
            "react": "React",
            "next": "Next.js",
            "vue": "Vue.js",
            "angular": "Angular",
            "express": "Express.js",
            # Java
            "spring": "Spring Boot",
            # PHP
            "laravel": "Laravel",
            "symfony": "Symfony",
        },
        "tools": {
            "mongodb": "MongoDB",
            "mysql": "MySQL",
            "sqlite": "SQLite",
            "postgres": "PostgreSQL",
            "firebase": "Firebase",
            "docker": "Docker",
            "aws": "AWS",
            "gcp": "Google Cloud",
            "azure": "Azure",
            "tensorflow": "TensorFlow",
            "sklearn": "Scikit-learn",
            "pytorch": "PyTorch",
            "redis": "Redis",
        },
    }

    detected = {"languages": set(), "frameworks": set(), "tools": set()}

    project_path = Path(project_path)

    # --- Step 1: Detect by file extensions ---
    for root, _, files in os.walk(project_path):
        for file in files:
            ext = Path(file).suffix.lower()
            if ext in tech_keywords["languages"]:
                detected["languages"].add(tech_keywords["languages"][ext])

            # Read a few lines to detect frameworks/tools
            try:
                with open(Path(root) / file, "r", encoding="utf-8", errors="ignore") as f:
                    head = f.read(5000).lower()  # read first 5KB
                    for word, tech in tech_keywords["frameworks"].items():
                        if word in head:
                            detected["frameworks"].add(tech)
                    for word, tool in tech_keywords["tools"].items():
                        if word in head:
                            detected["tools"].add(tool)
            except Exception:
                pass

    # --- Step 2: Detect via dependency files ---
    dependency_files = {
        "requirements.txt": "python",
        "package.json": "node",
        "pom.xml": "java",
        "composer.json": "php",
    }

    for dep_file, lang in dependency_files.items():
        f_path = project_path / dep_file
        if f_path.exists():
            if lang == "python":
                detected["languages"].add("Python")
                with open(f_path, "r", encoding="utf-8") as f:
                    content = f.read().lower()
                    if "flask" in content:
                        detected["frameworks"].add("Flask")
                    if "django" in content:
                        detected["frameworks"].add("Django")
                    if "fastapi" in content:
                        detected["frameworks"].add("FastAPI")
                    if "tensorflow" in content:
                        detected["tools"].add("TensorFlow")
                    if "scikit-learn" in content:
                        detected["tools"].add("Scikit-learn")
            elif lang == "node":
                detected["languages"].add("JavaScript")
                with open(f_path, "r", encoding="utf-8") as f:
                    content = f.read().lower()
                    if "react" in content:
                        detected["frameworks"].add("React")
                    if "express" in content:
                        detected["frameworks"].add("Express.js")
                    if "next" in content:
                        detected["frameworks"].add("Next.js")
            elif lang == "java":
                detected["languages"].add("Java")
                detected["frameworks"].add("Spring Boot")
            elif lang == "php":
                detected["languages"].add("PHP")
                detected["frameworks"].add("Laravel")

    # --- Step 3: Convert to list for JSON ---
    result = {
        "languages": sorted(list(detected["languages"])),
        "frameworks": sorted(list(detected["frameworks"])),
        "tools": sorted(list(detected["tools"])),
    }

    print("Detected Tech Stack:", result)
    return result


if __name__ == "__main__":
    # quick local test
    sample_path = r"C:\Users\HP\Desktop\webdev\personal\E-commerce"
    print(json.dumps(detect_stack(sample_path), indent=2))
