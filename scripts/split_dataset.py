import os
import random
import shutil

SOURCE_DIR = "ml/datasets/lego_classification_10k"          # your current folder with class folders
OUTPUT_DIR = "ml/datasets/lego_splitted"    # new output folder

TRAIN_RATIO = 0.8
VAL_RATIO = 0.1
TEST_RATIO = 0.1

random.seed(42)

os.makedirs(OUTPUT_DIR, exist_ok=True)

for split in ["train", "val", "test"]:
    os.makedirs(os.path.join(OUTPUT_DIR, split), exist_ok=True)

classes = [d for d in os.listdir(SOURCE_DIR) if os.path.isdir(os.path.join(SOURCE_DIR, d))]

for cls in classes:
    cls_path = os.path.join(SOURCE_DIR, cls)
    images = [f for f in os.listdir(cls_path) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    random.shuffle(images)

    n = len(images)
    n_train = int(n * TRAIN_RATIO)
    n_val = int(n * VAL_RATIO)

    splits = {
        "train": images[:n_train],
        "val": images[n_train:n_train + n_val],
        "test": images[n_train + n_val:]
    }

    for split, files in splits.items():
        out_cls_dir = os.path.join(OUTPUT_DIR, split, cls)
        os.makedirs(out_cls_dir, exist_ok=True)

        for f in files:
            src = os.path.join(cls_path, f)
            dst = os.path.join(out_cls_dir, f)
            shutil.copy2(src, dst)

print("✅ Done splitting dataset!")
