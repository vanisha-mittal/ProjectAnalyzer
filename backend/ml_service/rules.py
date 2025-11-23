import os
import json

def detect_tech_stack(project_path):
tech = set()

# helper
def exists(*names):
    return any(os.path.exists(os.path.join(project_path, n)) for n in names)

# ===== JavaScript / Node =====
if exists("package.json"):
    tech.add("Node.js")
    with open(os.path.join(project_path, "package.json"), "r", errors="ignore") as f:
        try:
            pkg = json.load(f)
            deps = json.dumps(pkg).lower()

            if "react" in deps: tech.add("React")
            if "next" in deps: tech.add("Next.js")
            if "express" in deps: tech.add("Express")
            if "vue" in deps: tech.add("Vue")
            if "angular" in deps: tech.add("Angular")
            if "tailwind" in deps: tech.add("TailwindCSS")
        except:
            pass

# ===== Python =====
if exists("app.py"):
    tech.add("Flask")

if exists("manage.py"):
    tech.add("Django")

if exists("requirements.txt"):
    with open(os.path.join(project_path, "requirements.txt"), "r", errors="ignore") as f:
        txt = f.read().lower()
        if "flask" in txt: tech.add("Flask")
        if "django" in txt: tech.add("Django")
        if "fastapi" in txt: tech.add("FastAPI")

# ===== Java =====
if exists("pom.xml"):
    tech.add("Spring Boot")
    tech.add("Java")

if exists("build.gradle"):
    tech.add("Java")

# ===== PHP =====
if exists("composer.json"):
    tech.add("PHP")
    tech.add("Laravel")

# ===== Android =====
if exists("AndroidManifest.xml"):
    tech.add("Android")

# ===== Flutter =====
if exists("pubspec.yaml"):
    tech.add("Flutter")

# ===== C/C++ =====
for root, _, files in os.walk(project_path):
    for f in files:
        if f.endswith(".c"): tech.add("C")
        if f.endswith(".cpp"): tech.add("C++")
        if f.endswith(".java"): tech.add("Java")

return list(tech)
