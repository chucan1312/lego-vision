import json

PARTS_PATH = "../data/labels/parts.json"

def load_parts_map():
    with open(PARTS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
