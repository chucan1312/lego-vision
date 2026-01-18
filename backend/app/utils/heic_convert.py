import os
from PIL import Image

import pi_heif
pi_heif.register_heif_opener()


def convert_heic_to_jpg_if_needed(input_path: str) -> str:
    ext = os.path.splitext(input_path)[1].lower()
    if ext not in [".heic", ".heif"]:
        return input_path

    img = Image.open(input_path).convert("RGB")
    output_path = os.path.splitext(input_path)[0] + ".jpg"
    img.save(output_path, "JPEG", quality=95)

    # delete original heic
    if os.path.exists(input_path):
        os.remove(input_path)

    return output_path
