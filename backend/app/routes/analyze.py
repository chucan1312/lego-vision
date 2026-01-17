from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # For now: return mock results so frontend can work
    return {
        "filename": file.filename,
        "detected_parts": [
            {"part": "2x4_brick", "count": 5, "avg_conf": 0.91},
            {"part": "2x2_brick", "count": 3, "avg_conf": 0.88},
            {"part": "wheel_small", "count": 4, "avg_conf": 0.93},
        ],
    }
