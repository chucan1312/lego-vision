import os
import uuid
from fastapi import APIRouter, UploadFile, File

from app.services.vision_pipeline import detect_and_classify
from app.utils.image_normalize import normalize_to_rgb
from app.utils.heic_convert import convert_to_jpg_if_needed

router = APIRouter()

# Always save into TOP-LEVEL /data/uploads (not backend/data/uploads)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))  # project root
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower() or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    # 1) Save file first
    with open(save_path, "wb") as f:
        f.write(await file.read())

    # 2) Convert HEIC -> JPG if needed
    save_path = convert_to_jpg_if_needed(save_path)

    # 3) Convert RGBA/PNG/etc -> RGB to avoid KeyError: 'RGBA'
    save_path = normalize_to_rgb(save_path)

    # If conversion changed extension (heic/png -> jpg), update filename
    filename = os.path.basename(save_path)

    # 4) Run detection + crop + classify
    detections = detect_and_classify(save_path)

    return {
        "imageUrl": f"http://localhost:8000/static/uploads/{filename}",
        "detections": detections
    }
