import os
import json

def detect_tech_stack(project_path):
    tech = set()

    # --------------------------------------------------------------------
    # Helper: recursively find files
    # --------------------------------------------------------------------
    def find_files(*names):
        paths = []
        for root, dirs, files in os.walk(project_path):
            for n in names:
                if n in files:
                    paths.append(os.path.join(root, n))
        return paths

    # --------------------------------------------------------------------
    # Helper: search file contents for keywords
    # --------------------------------------------------------------------
    def scan_for_keywords(ext_list, keywords):
        for root, dirs, files in os.walk(project_path):
            for f in files:
                if any(f.endswith(ext) for ext in ext_list):
                    try:
                        with open(os.path.join(root, f), "r", errors="ignore") as fp:
                            content = fp.read().lower()
                            for word, label in keywords.items():
                                if word in content:
                                    tech.add(label)
                    except:
                        pass

    # --------------------------------------------------------------------
    # 1) package.json — React, Vue, Angular, Node, Express, Tailwind…
    # --------------------------------------------------------------------
    pkg_files = find_files("package.json")
    if pkg_files:
        tech.add("Node.js")

        for pkg_path in pkg_files:
            try:
                with open(pkg_path, "r", errors="ignore") as f:
                    pkg = json.load(f)
                    deps = json.dumps(pkg).lower()

                    lib_map = {
                        "react": "React",
                        "react-native": "React Native",
                        "next": "Next.js",
                        "vite": "Vite",
                        "redux": "Redux",
                        "express": "Express",
                        "mongoose": "Mongoose",
                        "nodemon": "Node.js",
                        "vue": "Vue",
                        "nuxt": "Nuxt.js",
                        "angular": "Angular",
                        "tailwind": "TailwindCSS",
                        "bootstrap": "Bootstrap",
                        "firebase": "Firebase",
                        "socket.io": "Socket.io",
                        "typescript": "TypeScript"
                    }

                    for lib, label in lib_map.items():
                        if lib in deps:
                            tech.add(label)

            except Exception as e:
                print("Error reading package.json:", e)

    # --------------------------------------------------------------------
    # 2) Python — Flask, Django, FastAPI, ML libs
    # --------------------------------------------------------------------
    req_files = find_files("requirements.txt")
    if req_files:
        for req in req_files:
            with open(req, "r", errors="ignore") as f:
                txt = f.read().lower()

                py_libs = {
                    "flask": "Flask",
                    "django": "Django",
                    "fastapi": "FastAPI",
                    "pandas": "Pandas",
                    "numpy": "NumPy",
                    "sklearn": "Scikit-Learn",
                    "torch": "PyTorch",
                    "tensorflow": "TensorFlow",
                    "matplotlib": "Matplotlib"
                }

                for lib, label in py_libs.items():
                    if lib in txt:
                        tech.add(label)

    # detect Django structure
    if find_files("manage.py"):
        tech.add("Django")

    # Flask indicators
    flask_keywords = {
        "from flask": "Flask",
        "flask import": "Flask",
    }
    scan_for_keywords([".py"], flask_keywords)

    # --------------------------------------------------------------------
    # 3) Java — Spring, Maven, Gradle
    # --------------------------------------------------------------------
    if find_files("pom.xml"):
        tech.add("Java")
        tech.add("Spring Boot")

    if find_files("build.gradle"):
        tech.add("Java")
        tech.add("Gradle")

    # Java files
    java_keywords = {
        "@RestController": "Spring Boot",
        "springapplication.run": "Spring Boot",
    }
    scan_for_keywords([".java"], java_keywords)

    # --------------------------------------------------------------------
    # 4) PHP — Laravel, Core PHP
    # --------------------------------------------------------------------
    if find_files("composer.json"):
        tech.add("PHP")
        tech.add("Laravel")

    php_keywords = {
        "namespace app\\": "Laravel",
        "route::get": "Laravel",
    }
    scan_for_keywords([".php"], php_keywords)

    # --------------------------------------------------------------------
    # 5) Mobile — Android, Flutter, Kotlin
    # --------------------------------------------------------------------
    if find_files("AndroidManifest.xml"):
        tech.add("Android")

    if find_files("pubspec.yaml"):
        tech.add("Flutter")

    mobile_keywords = {
        "androidx": "Android",
        "flutter": "Flutter",
        "kotlin": "Kotlin",
    }
    scan_for_keywords([".kt", ".dart", ".xml"], mobile_keywords)

    # --------------------------------------------------------------------
    # 6) C / C++ / Go / Rust
    # --------------------------------------------------------------------
    scan_for_keywords([".c"], {"#include": "C"})
    scan_for_keywords([".cpp"], {"#include": "C++"})
    scan_for_keywords([".rs"], {"fn main": "Rust"})
    scan_for_keywords([".go"], {"package main": "Go"})

    # --------------------------------------------------------------------
    # 7) SQL + Databases
    # --------------------------------------------------------------------
    db_keywords = {
        "select ": "SQL",
        "insert into": "SQL",
        "mongodb": "MongoDB",
        "mongoose": "Mongoose",
        "prisma": "PrismaORM",
        "typeorm": "TypeORM",
    }
    scan_for_keywords(
        [".sql", ".js", ".ts", ".py"],
        db_keywords
    )

    # --------------------------------------------------------------------
    # 8) Frontend frameworks inside .html/.js/.jsx
    # --------------------------------------------------------------------
    frontend_keywords = {
        "reactdom": "React",
        "vue.createapp": "Vue",
        "angular.module": "AngularJS",
    }
    scan_for_keywords([".js", ".jsx", ".html"], frontend_keywords)

    # --------------------------------------------------------------------
    # 9) Docker / DevOps
    # --------------------------------------------------------------------
    if find_files("Dockerfile"):
        tech.add("Docker")

    if find_files("docker-compose.yml"):
        tech.add("Docker Compose")

    # --------------------------------------------------------------------
    # Final return
    # --------------------------------------------------------------------
    return list(sorted(tech))
