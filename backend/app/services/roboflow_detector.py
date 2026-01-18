import os
from roboflow import Roboflow
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ROBOFLOW_API_KEY")

WORKSPACE = "unitn-ice-robotica"
PROJECT = "lego-detection-8oqvi"
VERSION = 1  # if your Roboflow page shows another version, change it

rf = Roboflow(api_key=API_KEY)
project = rf.workspace(WORKSPACE).project(PROJECT)
model = project.version(VERSION).model

def detect(image_path: str, confidence=30, overlap=30):
    """
    Returns list of predictions:
    [{x,y,width,height,confidence,class,...}]
    """
    result = model.predict(image_path, confidence=confidence).json()
    return result.get("predictions", [])

def to_xywh(pred):
    """
    Roboflow gives center x,y + width,height.
    Convert to top-left x,y + width,height.
    """
    cx, cy = pred["x"], pred["y"]
    w, h = pred["width"], pred["height"]
    return {
        "x": int(cx - w / 2),
        "y": int(cy - h / 2),
        "w": int(w),
        "h": int(h),
    }
