import os
import uuid
from fastapi import APIRouter, UploadFile, File

from app.services.vision_pipeline import detect_and_classify

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    with open(save_path, "wb") as f:
        f.write(await file.read())

    detections = detect_and_classify(save_path)

    return {
        "imageUrl": f"http://localhost:8000/static/uploads/{filename}",
        "detections": detections
    }
