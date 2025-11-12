import pandas as pd
import random

tech_snippets = {
    "React": [
        "import React from 'react'; export default function App() { return <h1>Hello</h1>; }",
        "import ReactDOM from 'react-dom/client'; import App from './App';",
        "const [count, setCount] = useState(0);"
    ],
    "Angular": [
        "import { Component } from '@angular/core'; @Component({ selector: 'app-root', templateUrl: './app.component.html' })",
        "<router-outlet></router-outlet>",
        "import { NgModule } from '@angular/core'; import { BrowserModule } from '@angular/platform-browser';"
    ],
    "Node.js": [
        "const express = require('express'); const app = express(); app.listen(3000);",
        "import express from 'express'; const app = express();",
        "app.get('/', (req, res) => res.send('Hello World'));"
    ],
    "Django": [
        "from django.shortcuts import render",
        "from django.http import HttpResponse",
        "class MyModel(models.Model): name = models.CharField(max_length=100)"
    ],
    "Flask": [
        "from flask import Flask; app = Flask(__name__); app.run()",
        "@app.route('/') def home(): return 'Flask app running'",
        "from flask import jsonify"
    ],
    "Spring Boot": [
        "@SpringBootApplication public class Application { public static void main(String[] args){ SpringApplication.run(Application.class, args); } }",
        "import org.springframework.web.bind.annotation.*;",
        "@RestController class HelloController { @GetMapping('/') String hi(){ return 'Hi'; } }"
    ],
    "Go": [
        "package main; import 'fmt'; func main() { fmt.Println('Go!') }",
        "import 'net/http'; func main() { http.ListenAndServe(':8080', nil) }"
    ],
    "Ruby on Rails": [
        "class ApplicationController < ActionController::Base end",
        "rails generate scaffold Post title:string body:text",
        "def index; @posts = Post.all; end"
    ],
    "ASP.NET": [
        "using Microsoft.AspNetCore.Mvc;",
        "public class HomeController : Controller { public IActionResult Index() => View(); }",
        "app.MapGet('/', () => 'Hello ASP.NET');"
    ],
    "Vue.js": [
        "<template><div>{{ message }}</div></template><script>export default { data() { return { message: 'Hi Vue' }}}</script>",
        "import { createApp } from 'vue'; createApp(App).mount('#app');",
        "export default { name: 'App', components: {} }"
    ]
}

extensions = {
    "React": ".js",
    "Angular": ".ts",
    "Node.js": ".js",
    "Django": ".py",
    "Flask": ".py",
    "Spring Boot": ".java",
    "Go": ".go",
    "Ruby on Rails": ".rb",
    "ASP.NET": ".cs",
    "Vue.js": ".vue"
}

data = []
id_counter = 1

for _ in range(100):
    stack = random.choice(list(tech_snippets.keys()))
    content = random.choice(tech_snippets[stack])
    data.append({
        "id": id_counter,
        "filename": f"file_{id_counter}{extensions[stack]}",
        "file_extension": extensions[stack],
        "file_content": content,
        "tech_stack": stack
    })
    id_counter += 1

df = pd.DataFrame(data)
df.to_csv("techstack_dataset.csv", index=False)
print("✅ Dataset saved as techstack_dataset.csv with", len(df), "rows.")
