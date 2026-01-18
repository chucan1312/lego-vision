import os
import uuid
import cv2
from ultralytics import YOLO

from app.services.roboflow_detector import detect, to_xywh

# CHANGE THIS to your classifier model path
CLASSIFIER_PATH = "../ml/models/best.pt"
classifier = YOLO(CLASSIFIER_PATH)

CROP_DIR = "../data/uploads/crops"
os.makedirs(CROP_DIR, exist_ok=True)


def detect_and_classify(image_path: str, confidence=30):
    """
    1) Roboflow detects LEGO pieces -> bounding boxes
    2) Crop each bbox
    3) Run YOLO classifier on each crop
    4) Return detections with label + bbox
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")

    H, W = img.shape[:2]

    preds = detect(image_path, confidence=confidence)

    results = []
    for p in preds:
        bbox = to_xywh(p)

        # Clamp bbox to image bounds
        x1 = max(0, bbox["x"])
        y1 = max(0, bbox["y"])
        x2 = min(W, x1 + bbox["w"])
        y2 = min(H, y1 + bbox["h"])

        crop = img[y1:y2, x1:x2]
        if crop.size == 0:
            continue

        # Save crop (optional but useful for debugging)
        crop_name = f"{uuid.uuid4().hex}.jpg"
        crop_path = os.path.join(CROP_DIR, crop_name)
        cv2.imwrite(crop_path, crop)

        # Classify the crop
        cls = classifier(crop_path)[0]
        top1_idx = int(cls.probs.top1)
        top1_conf = float(cls.probs.top1conf)
        label = cls.names[top1_idx]

        results.append({
            "id": p.get("detection_id"),
            "label": label,  # <-- classifier label replaces "undefined"
            "confidence": round(top1_conf, 4),
            "bbox": {
                "x": x1,
                "y": y1,
                "w": x2 - x1,
                "h": y2 - y1,
            },
            # optional debug info:
            "detConfidence": p.get("confidence"),
            "rfClass": p.get("class"),
            "cropPath": f"uploads/crops/{crop_name}"
        })

    return results
