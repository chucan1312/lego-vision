import os
import uuid
from fastapi import APIRouter, UploadFile, File

from app.services.vision_pipeline import detect_and_classify
from app.utils.heic_convert import convert_heic_to_jpg_if_needed
from app.utils.image_normalize import force_jpg

router = APIRouter()

# top-level data/uploads (safe across machines)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))  # project root
DATA_DIR = os.path.join(BASE_DIR, "../data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # save raw upload first
    ext = os.path.splitext(file.filename)[1].lower() or ".jpg"
    raw_name = f"{uuid.uuid4().hex}{ext}"
    raw_path = os.path.join(UPLOAD_DIR, raw_name)

    with open(raw_path, "wb") as f:
        f.write(await file.read())

    # convert HEIC -> JPG if needed
    path = convert_heic_to_jpg_if_needed(raw_path)

    # convert EVERYTHING to JPG (fixes RGBA png issues)
    path = force_jpg(path)

    filename = os.path.basename(path)

    detections = detect_and_classify(path)

    return {
        "imageUrl": f"http://localhost:8000/static/uploads/{filename}",
        "detections": detections
    }
