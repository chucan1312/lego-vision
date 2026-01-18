import os
from PIL import Image


def force_jpg(input_path: str) -> str:
    """
    Converts image to RGB JPG.
    Removes alpha channel (RGBA) safely.
    Deletes original file if extension changes.
    """
    img = Image.open(input_path)

    if img.mode != "RGB":
        img = img.convert("RGB")

    output_path = os.path.splitext(input_path)[0] + ".jpg"
    img.save(output_path, "JPEG", quality=95)

    # remove original if different
    if output_path != input_path and os.path.exists(input_path):
        os.remove(input_path)

    return output_path
