import os
from PIL import Image

# IMPORTANT: this registers HEIC/HEIF support into Pillow
import pi_heif
pi_heif.register_heif_opener()


def convert_to_jpg_if_needed(input_path: str) -> str:
    """
    Converts .heic/.heif to .jpg and returns the new path.
    If file is not HEIC/HEIF, returns original path unchanged.
    """
    ext = os.path.splitext(input_path)[1].lower()

    if ext not in [".heic", ".heif"]:
        return input_path

    img = Image.open(input_path).convert("RGB")
    output_path = os.path.splitext(input_path)[0] + ".jpg"
    img.save(output_path, "JPEG", quality=95)

    return output_path
