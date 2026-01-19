# 🧱 LEGO Vision

A computer-vision web app that lets users upload a photo of a LEGO pile, detects the pieces inside, classifies them, and suggests what builds (“recipes”) you can complete based on your available inventory — with an interactive detection viewer and build instruction previews.

## ✨ Features

- Upload-to-Analyze Workflow: Upload an image of your LEGO pile and instantly get results.
- 2-Stage Computer Vision Pipeline:
  + Detection (Roboflow model) finds LEGO piece bounding boxes in a pile.
  + Classification (YOLOv8 classifier) predicts what each cropped piece is.
- Interactive Detection Viewer:
  + View the uploaded image with bounding boxes drawn on top and labels listed on sidebar
  + Clickable button to highlight certain pieces and check predicted labeling
- Build Matching System:
  + Converts detected parts into an inventory dictionary (piece → count).
  + Matches your inventory against recipe requirements and returns the Top 10 builds.
- Instruction Preview Page: shows step-by-step instruction images for a selected build.

## 🚧 In Progress
- Better classification accuracy (reducing classes, more training images, tuning augmentation)
- More recipes (bigger dataset, more fun builds)
- Piece name mapping improvements (full official names + user-friendly labels)
- UI polish (animations, better overlay visuals, mobile-friendly layout)

## 🚀 Run Locally
### Prerequisites
Make sure you have these installed:
```
Python 3.10+
Node.js (v16+)
pip
(Optional) Git
```
### Backend Setup (FastAPI)
Go into the backend folder:
```
cd backend
```

Create + activate a virtual environment:
```
python -m venv venv
```

Windows (PowerShell):
```
.\venv\Scripts\Activate.ps1
```

Mac/Linux:
```
source venv/bin/activate
```

Install dependencies:
```
pip install -r requirements.txt
```

Create your .env file inside backend/:
```
ROBOFLOW_API_KEY=your_key_here
```

Start the FastAPI server:
```
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

API docs (Swagger): http://localhost:8000/docs

### Frontend Setup (React + Vite)

Go into the frontend folder:
```
cd frontend
```

Install dependencies:
```
npm install
```

Run the dev server:
```
npm run dev
```

Frontend runs at: http://localhost:5173

## 🛠️ Tech Stack

Frontend:
React (Vite)
Tailwind CSS
Fetch / REST API calls

Backend:
Python
FastAPI
Uvicorn

Computer Vision:
Roboflow (Detection API)
Ultralytics YOLOv8 (Classification model)

Data:
JSON-based recipe storage (data/recipes/recipes.json)
JSON parts mapping (data/parts/parts.json)
Static instructions images served from backend

## 👥 Authors & Hackathon

This project was created for **nwHacks 2026**

### **Authors**
- **Chuc An Trinh** — Developer
- **Chau Thai** — Developer

### **Devpost**
Learn more about the project on our Devpost submission:  
👉 **[[LEGO Vision](https://devpost.com/software/lego-vision?_gl=1*15w3kun*_gcl_au*MzIyNTkyMjU2LjE3NjEyNzE2MTU.*_ga*NTA5MDk2MzQ3LjE3NjEyNzE2MTY.*_ga_0YHJK3Y10M*czE3Njg3NzY5MTUkbzMzJGcxJHQxNzY4Nzc4MDA3JGo2MCRsMCRoMA..)]**
