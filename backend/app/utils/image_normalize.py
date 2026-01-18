from PIL import Image

def normalize_to_rgb(input_path: str) -> str:
    """
    Ensures the image is RGB (no alpha channel).
    Overwrites the same file path.
    """
    img = Image.open(input_path)

    # Convert RGBA / P / LA / etc -> RGB
    if img.mode != "RGB":
        img = img.convert("RGB")
        img.save(input_path, "JPEG", quality=95)

    return input_path
